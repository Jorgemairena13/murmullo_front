import { useState, useEffect } from "react"
import { NavLink } from "react-router-dom"
import logo from "../assets/img/logo.png"
import { useAuth } from "../context/AuthContext"
import { SettingsModal } from "./SettingsModal"
import { ActivityModal } from "./ActivityModal"
import { getNotifications } from "../services/notificationService"
import { getFollowRequests } from "../services/followRequestService"

export const SideBar = () => {
    const { user } = useAuth();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [activityOpen, setActivityOpen] = useState(false);
    const [badgeCount, setBadgeCount] = useState(0);

    useEffect(() => {
        if (!user) return;
        let cancelled = false;
        (async () => {
            try {
                const [notifData, reqData] = await Promise.all([
                    getNotifications(),
                    getFollowRequests(),
                ]);
                if (cancelled) return;
                const unread = notifData.unread_count || 0;
                const reqList = reqData.follow_requests || reqData.data || reqData || [];
                setBadgeCount(unread + reqList.length);
            } catch {
                if (!cancelled) setBadgeCount(0);
            }
        })();
        return () => { cancelled = true; };
    }, [user]);

    const refetchBadge = async () => {
        if (!user) return;
        try {
            const [notifData, reqData] = await Promise.all([
                getNotifications(),
                getFollowRequests(),
            ]);
            const unread = notifData.unread_count || 0;
            const reqList = reqData.follow_requests || reqData.data || reqData || [];
            setBadgeCount(unread + reqList.length);
        } catch {
            setBadgeCount(0);
        }
    };

    const handleActivityClose = () => {
        setActivityOpen(false);
        refetchBadge();
    };

    const datosLink = [
        {
            className: 'fi fi-rr-home',
            text: 'Inicio',
            route: '/'
        },
        {
            className: 'fi fi-rr-search',
            text: 'Buscar',
            route: '/busqueda'
        },
        {
            className: 'fi fi-rr-map',
            text: 'Explorar',
            route: '/explorar'
        },
        {
            className: 'fi fi-rr-user',
            text: 'Perfil',
            route: user ? `/profile/${user.id}` : '/profile'
        },
    ]

    return (
        <>
            <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-t border-gray-800 z-50 pb-[env(safe-area-inset-bottom)]
                md:fixed md:top-0 md:left-0 md:bottom-0 md:right-auto md:w-20 md:h-full md:bg-black md:border-r md:border-t-0 md:border-gray-800 lg:w-24 md:pb-0">

                <div className="hidden md:flex justify-center py-6">
                    <NavLink to="/" className="p-2 rounded-xl hover:bg-gray-800/50 transition-all duration-300">
                        <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
                    </NavLink>
                </div>

                <div className="flex justify-around items-center h-[72px] px-2
                    md:flex-col md:h-auto md:py-4 md:px-0 md:gap-2">
                    
                    {datosLink.map((datos) => (
                        <NavLink
                            className={({ isActive }) => {
                                const baseClass = "flex flex-col items-center gap-0.5 justify-center w-[64px] h-full rounded-xl transition-all duration-300"
                                const activeClass = isActive 
                                    ? "bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20" 
                                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                                return `${baseClass} ${activeClass}`
                            }}
                            to={datos.route}
                            key={datos.text}
                            title={datos.text}
                        >
                            <i className={`${datos.className} text-xl`}></i>
                            <span className="text-[10px] leading-tight font-medium">{datos.text}</span>
                        </NavLink>
                    ))}

                    {user && (
                        <button
                            onClick={() => setActivityOpen(true)}
                            className="relative flex flex-col items-center gap-0.5 justify-center w-[64px] h-full rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-gray-800/50"
                            title="Actividad"
                        >
                            <i className="fi fi-rr-bell text-xl"></i>
                            {badgeCount > 0 && (
                                <span className="absolute -top-0.5 right-2.5 md:right-1 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-1">
                                    {badgeCount > 9 ? '9+' : badgeCount}
                                </span>
                            )}
                            <span className="text-[10px] leading-tight font-medium">Actividad</span>
                        </button>
                    )}

                    {user && (
                        <button
                            onClick={() => setSettingsOpen(true)}
                            className="flex flex-col items-center gap-0.5 justify-center w-[64px] h-full rounded-xl transition-all duration-300 text-gray-400 hover:text-white hover:bg-gray-800/50"
                            title="Configuración"
                        >
                            <i className="fi fi-rr-settings text-xl"></i>
                            <span className="text-[10px] leading-tight font-medium">Ajustes</span>
                        </button>
                    )}
                </div>
            </nav>

            <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
            <ActivityModal isOpen={activityOpen} onClose={handleActivityClose} onUpdate={refetchBadge} />
        </>
    )
}
