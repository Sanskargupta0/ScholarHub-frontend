import React from 'react'
import { components } from '../../../components'

function Notification() {
  const data = [
    {
      title: "New Order",
      description: "You have received a new order.",
      date: new Date().toString(),
    },
    {
      title: "New User",
      description: "A new user has registered.",
      date: new Date().toString(),
    },
    {
      title: "New Message",
      description: "You have received a new message.",
      date: new Date().toString(),
    },
    {
      title: "New Comment",
      description: "You have a new comment.",
      date: new Date().toString(),
    },
  ];
  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-800 mb-6" style={{"color":"#1DB398"}}>Notifications</h1>
        <div className="space-y-4">
          {
            data.map((item, index) => (
              <components.NotificationCard key={index} title={item.title} description={item.description} date={item.date} />
            ))
          }
        </div>
    </div>
  )
}

export default Notification