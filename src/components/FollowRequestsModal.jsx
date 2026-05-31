import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from '../services/followRequestService';
import { Skeleton } from './Skeleton';
import { BASE_URL } from '../services/client';

const RequestSkeleton = () => (
    <div className="flex items-center gap-3 p-3">
        <Skeleton className="w-11 h-11 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32 rounded" />
            <Skeleton className="h-3 w-20 rounded" />
        </div>
        <div className="flex gap-2">
            <Skeleton className="w-20 h-8 rounded-full" />
            <Skeleton className="w-20 h-8 rounded-full" />
        </div>
    </div>
);

export const FollowRequestsModal = ({ isOpen, onClose, onUpdate }) => {
    const overlayRef = useRef(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (isOpen) fetchRequests();
    }, [isOpen]);

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getFollowRequests();
            setRequests(data.follow_requests || data.data || data || []);
        } catch (err) {
            console.error('Error fetching follow requests:', err);
            setError('Error al cargar solicitudes');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        setActionLoading(requestId);
        try {
            await acceptFollowRequest(requestId);
            setRequests(prev => prev.filter(r => r.id !== requestId));
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Error accepting request:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleReject = async (requestId) => {
        setActionLoading(requestId);
        try {
            await rejectFollowRequest(requestId);
            setRequests(prev => prev.filter(r => r.id !== requestId));
        } catch (err) {
            console.error('Error rejecting request:', err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-gray-800 shrink-0">
                    <h2 className="text-xl font-bold text-white">Solicitudes de seguimiento</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-3">
                    {loading && (
                        <div className="divide-y divide-gray-800">
                            {[1, 2, 3].map(i => <RequestSkeleton key={i} />)}
                        </div>
                    )}

                    {error && !loading && (
                        <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                            <p className="text-gray-400 text-sm">{error}</p>
                            <button
                                onClick={fetchRequests}
                                className="px-4 py-2 bg-purple-600 rounded-lg text-sm hover:bg-purple-500 transition-colors"
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {!loading && !error && requests.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="text-gray-500 font-medium">No tienes solicitudes pendientes</p>
                        </div>
                    )}

                    {!loading && !error && requests.length > 0 && (
                        <div className="divide-y divide-gray-800">
                            {requests.map(request => {
                                const requester = request.seguidor || request.user || request;
                                const isLoading = actionLoading === request.id;
                                return (
                                    <div key={request.id} className="flex items-center gap-3 p-3">
                                        <Link
                                            to={`/profile/${requester.id}`}
                                            onClick={onClose}
                                            className="flex items-center gap-3 flex-1 min-w-0"
                                        >
                                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold shrink-0 overflow-hidden">
                                                {requester.avatar_url ? (
                                                    <img
                                                        src={requester.avatar_url.startsWith('http') ? requester.avatar_url : `${BASE_URL}${requester.avatar_url}`}
                                                        alt={requester.nombre}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    requester.nombre?.charAt(0).toUpperCase() || 'U'
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-white font-semibold text-sm truncate">{requester.nombre}</p>
                                                <p className="text-gray-500 text-xs truncate">@{requester.username}</p>
                                            </div>
                                        </Link>
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => handleAccept(request.id)}
                                                disabled={isLoading}
                                                className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? '...' : 'Aceptar'}
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                disabled={isLoading}
                                                className="px-4 py-1.5 rounded-full text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
