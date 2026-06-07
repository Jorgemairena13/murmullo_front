import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getNotifications, markAllAsRead } from '../services/notificationService';
import { getFollowRequests, acceptFollowRequest, rejectFollowRequest } from '../services/followRequestService';
import { Skeleton } from './Skeleton';
import { Avatar } from './Avatar';

const SkeletonRow = () => (
    <div className="flex items-center gap-3 p-3">
        <Skeleton className="w-11 h-11 rounded-full shrink-0" />
        <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-48 rounded" />
            <Skeleton className="h-3 w-16 rounded" />
        </div>
    </div>
);

const notificationText = (notif) => {
    const name = notif.data?.actor?.nombre || 'Alguien';
    switch (notif.type) {
        case 'post_liked': return `${name} le gustó tu publicación`;
        case 'post_commented': return `${name} comentó tu publicación`;
        case 'user_followed': return `${name} empezó a seguirte`;
        case 'follow_request_sent': return `${name} quiere seguirte`;
        case 'follow_request_accepted': return `${name} aceptó tu solicitud`;
        default: return `${name} interactuó contigo`;
    }
};

const notificationLink = (notif) => {
    if ((notif.type === 'post_liked' || notif.type === 'post_commented') && notif.data?.post_id) {
        return `/post/${notif.data.post_id}`;
    }
    if (notif.data?.actor?.id) {
        return `/profile/${notif.data.actor.id}`;
    }
    return '#';
};

export const ActivityModal = ({ isOpen, onClose, onUpdate }) => {
    const overlayRef = useRef(null);

    const [tab, setTab] = useState('notifications');
    const [notifications, setNotifications] = useState([]);
    const [requests, setRequests] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [markingRead, setMarkingRead] = useState(false);

    useEffect(() => {
        if (isOpen) fetchData();
    }, [isOpen]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [notifData, reqData] = await Promise.all([
                getNotifications(),
                getFollowRequests(),
            ]);
            setNotifications(notifData.data || notifData.notifications || []);
            setUnreadCount(notifData.unread_count || 0);
            setRequests(reqData.follow_requests || reqData.data || reqData || []);
        } catch (err) {
            console.error('Error loading activity:', err);
            setError('Error al cargar actividad');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        setMarkingRead(true);
        try {
            await markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error('Error marking notifications as read:', err);
        } finally {
            setMarkingRead(false);
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

    const totalCount = notifications.length;
    const hasUnread = unreadCount > 0;

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        >
            <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
                <div className="flex items-center justify-between p-5 border-b border-gray-800 shrink-0">
                    <h2 className="text-xl font-bold text-white">Actividad</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex border-b border-gray-800 shrink-0">
                    <button
                        onClick={() => setTab('notifications')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                            tab === 'notifications'
                                ? 'text-white'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        Notificaciones
                        {hasUnread && (
                            <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                        {tab === 'notifications' && (
                            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                        )}
                    </button>
                    <button
                        onClick={() => setTab('requests')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                            tab === 'requests'
                                ? 'text-white'
                                : 'text-gray-500 hover:text-gray-300'
                        }`}
                    >
                        Solicitudes
                        {requests.length > 0 && (
                            <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {requests.length}
                            </span>
                        )}
                        {tab === 'requests' && (
                            <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full" />
                        )}
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-3">
                    {/* === TAB NOTIFICACIONES === */}
                    {tab === 'notifications' && (
                        <>
                            {loading && (
                                <div className="divide-y divide-gray-800">
                                    {[1, 2, 3, 4].map(i => <SkeletonRow key={i} />)}
                                </div>
                            )}

                            {error && !loading && (
                                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <p className="text-gray-400 text-sm">{error}</p>
                                    <button onClick={fetchData} className="px-4 py-2 bg-purple-600 rounded-lg text-sm hover:bg-purple-500 transition-colors">
                                        Reintentar
                                    </button>
                                </div>
                            )}

                            {!loading && !error && totalCount === 0 && (
                                <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    <p className="text-gray-500 font-medium">No hay notificaciones</p>
                                </div>
                            )}

                            {!loading && !error && totalCount > 0 && (
                                <div className="divide-y divide-gray-800">
                                    {notifications.map(notif => {
                                        const actor = notif.data?.actor || {};
                                        const isUnread = !notif.read_at;
                                        return (
                                            <Link
                                                key={notif.id}
                                                to={notificationLink(notif)}
                                                onClick={onClose}
                                                className={`flex items-center gap-3 p-3 hover:bg-gray-800/50 transition-colors rounded-lg ${
                                                    isUnread ? 'bg-purple-900/10' : ''
                                                }`}
                                            >
                                                <Avatar src={actor.avatar_url} name={actor.nombre} size={11} />
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm truncate ${isUnread ? 'text-white font-semibold' : 'text-gray-300'}`}>
                                                        {notificationText(notif)}
                                                    </p>
                                                    <p className="text-gray-500 text-xs">{notif.created_at || ''}</p>
                                                </div>
                                                {isUnread && (
                                                    <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}

                            {!loading && totalCount > 0 && (
                                <div className="sticky bottom-0 bg-gray-900 pt-3 pb-1">
                                    <button
                                        onClick={handleMarkAllRead}
                                        disabled={markingRead || !hasUnread}
                                        className="w-full py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {markingRead ? 'Marcando...' : 'Marcar todo leído'}
                                    </button>
                                </div>
                            )}
                        </>
                    )}

                    {/* === TAB SOLICITUDES === */}
                    {tab === 'requests' && (
                        <>
                            {loading && (
                                <div className="divide-y divide-gray-800">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="flex items-center gap-3 p-3">
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
                                    ))}
                                </div>
                            )}

                            {error && !loading && (
                                <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                    <p className="text-gray-400 text-sm">{error}</p>
                                    <button onClick={fetchData} className="px-4 py-2 bg-purple-600 rounded-lg text-sm hover:bg-purple-500 transition-colors">
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
                                        const isRequestLoading = actionLoading === request.id;
                                        return (
                                            <div key={request.id} className="flex items-center gap-3 p-3">
                                                <Link
                                                    to={`/profile/${requester.id}`}
                                                    onClick={onClose}
                                                    className="flex items-center gap-3 flex-1 min-w-0"
                                                >
                                                    <Avatar src={requester.avatar_url} name={requester.nombre} size={11} />
                                                    <div className="min-w-0">
                                                        <p className="text-white font-semibold text-sm truncate">{requester.nombre}</p>
                                                        <p className="text-gray-500 text-xs truncate">@{requester.username}</p>
                                                    </div>
                                                </Link>
                                                <div className="flex gap-2 shrink-0">
                                                    <button
                                                        onClick={() => handleAccept(request.id)}
                                                        disabled={isRequestLoading}
                                                        className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {isRequestLoading ? '...' : 'Aceptar'}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request.id)}
                                                        disabled={isRequestLoading}
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
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
