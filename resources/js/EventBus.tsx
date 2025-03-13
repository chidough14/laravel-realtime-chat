import { createContext, useContext, useState } from "react";

export const EventBusContext = createContext()

export const EventBusProvider = ({ children }: any) => {
  const [events, setEvents] = useState<any>({})

  const emit = (name: any, data: any) => {
    if (events[name]) {
      for (let cb of events[name]) {
        cb(data)
      }
    }
  }

  const on = (name: any, cb: any) => {
    if (!events[name]) {
      events[name] = []
    }

    events[name].push(cb)

    return () => {
      events[name] = events[name].filter((callback: any) => callback !== cb)
    }
  }

  return (
    <EventBusContext.Provider value={{ emit, on }}>
      {children}
    </EventBusContext.Provider>
  )
}

export const useEventBus = () => {
  return useContext(EventBusContext)
}
 
//////==============================================///////////////////////////

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// // Define types for event callbacks and event storage
// type EventCallback<T = any> = (data: T) => void;
// type EventMap = Record<string, EventCallback[]>;

// // Context type
// interface EventBusContextType {
//   emit: <T = any>(name: string, data: T) => void;
//   on: <T = any>(name: string, cb: EventCallback<T>) => () => void;
// }

// // Create Context
// const EventBusContext = createContext<EventBusContextType | null>(null);

// // Provider Component
// export const EventBusProvider = ({ children }: { children: ReactNode }) => {
//   const [events, setEvents] = useState<EventMap>({});

//   // Emit function (triggers events)
//   const emit = <T,>(name: string, data: T) => {
//     setEvents((prevEvents) => {
//       if (prevEvents[name]) {
//         prevEvents[name].forEach((callback) => callback(data));
//       }
//       return prevEvents; // Ensure state persists
//     });
//   };

//   // Subscribe to an event (returns an unsubscribe function)
//   const on = <T,>(name: string, cb: EventCallback<T>): (() => void) => {
//     setEvents((prevEvents) => {
//       const newEvents = { ...prevEvents };
//       if (!newEvents[name]) {
//         newEvents[name] = [];
//       }
//       newEvents[name] = [...newEvents[name], cb]; // Avoid mutating state
//       return newEvents;
//     });

//     return () => {
//       setEvents((prevEvents) => {
//         const newEvents = { ...prevEvents };
//         if (newEvents[name]) {
//           newEvents[name] = newEvents[name].filter((callback) => callback !== cb);
//           if (newEvents[name].length === 0) {
//             delete newEvents[name];
//           }
//         }
//         return newEvents;
//       });
//     };
//   };

//   return (
//     <EventBusContext.Provider value={{ emit, on }}>
//       {children}
//     </EventBusContext.Provider>
//   );
// };

// // Hook to access the event bus
// export const useEventBus = (): EventBusContextType => {
//   const context = useContext(EventBusContext);
//   if (!context) {
//     throw new Error("useEventBus must be used within an EventBusProvider");
//   }
//   return context;
// };
