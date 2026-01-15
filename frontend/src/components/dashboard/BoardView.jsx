import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { MapPin, Calendar, MoreHorizontal } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  APPLIED: { title: 'Applied', color: 'bg-blue-50 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  INTERVIEW: { title: 'Interview', color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  OFFER: { title: 'Offer', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  REJECTED: { title: 'Rejected', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' }
};

export default function BoardView({ jobs, onStatusChange }) {
  const [columns, setColumns] = useState({
    APPLIED: [], INTERVIEW: [], OFFER: [], REJECTED: []
  });

  useEffect(() => {
    const newCols = { APPLIED: [], INTERVIEW: [], OFFER: [], REJECTED: [] };
    jobs.forEach(job => {
      if (newCols[job.status]) newCols[job.status].push(job);
    });
    setColumns(newCols);
  }, [jobs]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = [...columns[source.droppableId]];
    const destCol = [...columns[destination.droppableId]];
    const [movedJob] = sourceCol.splice(source.index, 1);
    
    const updatedJob = { ...movedJob, status: destination.droppableId };
    destCol.splice(destination.index, 0, updatedJob);

    setColumns({
      ...columns,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    });

    try {
      await API.patch(`/jobs/${draggableId}/status`, { status: destination.droppableId });
      toast.success(`Moved to ${STATUS_CONFIG[destination.droppableId].title}`);
      if (onStatusChange) onStatusChange(); 
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="overflow-x-auto pb-8">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 min-w-[1000px]">
          {Object.entries(columns).map(([columnId, columnJobs]) => (
            <div key={columnId} className="flex-1 min-w-[280px]">
              <div className={`flex items-center justify-between p-4 rounded-2xl border-2 mb-4 ${STATUS_CONFIG[columnId].color}`}>
                <div className="flex items-center gap-2 font-black uppercase text-xs tracking-widest">
                  <div className={`w-2 h-2 rounded-full ${STATUS_CONFIG[columnId].dot}`} />
                  {STATUS_CONFIG[columnId].title}
                </div>
                <span className="font-bold opacity-60 bg-white/50 px-2 py-1 rounded-lg text-[10px]">
                  {columnJobs.length}
                </span>
              </div>

              <Droppable droppableId={columnId}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-3 min-h-[200px] transition-colors rounded-2xl p-2 ${
                      snapshot.isDraggingOver ? 'bg-slate-100/50 ring-2 ring-indigo-100' : ''
                    }`}
                  >
                    {columnJobs.map((job, index) => (
                      <Draggable key={job.id} draggableId={job.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md hover:border-indigo-100 transition-all ${
                              snapshot.isDragging ? 'shadow-2xl rotate-2 scale-105 ring-2 ring-indigo-500 z-50' : ''
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-black text-slate-800 text-sm leading-tight">{job.company}</h4>
                              <button className="text-slate-300 hover:text-indigo-600">
                                <MoreHorizontal size={16} />
                              </button>
                            </div>
                            
                            <p className="text-xs font-bold text-slate-400 mb-4">{job.position}</p>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                              <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                                <MapPin size={12} />
                                {job.location || 'Remote'}
                              </div>
                              <div className="text-[10px] font-black text-slate-300 uppercase">
                                {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}