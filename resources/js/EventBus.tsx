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