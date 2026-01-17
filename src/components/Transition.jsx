import { motion } from "framer-motion";

const variants = {
    initial: (direction) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.95, 
        zIndex: 10 
    }),
    animate: {
        x: 0,
        opacity: 1,
        scale: 1,
        zIndex: 1,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 }, // Efecto muelle suave
            opacity: { duration: 0.2 }
        }
    },
    exit: (direction) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        scale: 0.95, 
        zIndex: 0, 
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    })
};

const Transition = ({ children, direction }) => {
    return (
        <motion.div
            custom={direction}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-0 left-0 w-full h-full bg-gray-900 overflow-hidden" 
            
        >
            {children}
        </motion.div>
    );
};

export default Transition;