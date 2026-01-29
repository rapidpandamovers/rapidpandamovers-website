'use client'

import { CheckCircle, Clock, AlertCircle, Info, Printer } from 'lucide-react'

interface Task {
  task: string
  completed: boolean
  priority: string
}

interface ChecklistCategory {
  title: string
  description: string
  tasks: Task[]
}

interface MovingChecklistProps {
  title?: string
  description?: string
  categories?: ChecklistCategory[]
  tips?: string[]
  className?: string
}

export default function MovingChecklist({ 
  title = "Complete Moving Checklist",
  description = "Your comprehensive guide to a successful move",
  categories = [],
  tips = [],
  className = ""
}: MovingChecklistProps) {
  const handlePrintPDF = () => {
    window.print()
  }
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'medium':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'low':
        return <Info className="w-4 h-4 text-blue-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500 bg-red-50'
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'low':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <section className={`py-16 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {title}
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              {description}
            </p>
            <div className="flex justify-center no-print">
              <button
                onClick={handlePrintPDF}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print/Save PDF
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {categories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600">
                    {category.description}
                  </p>
                </div>
                
                <div className="space-y-3">
                  {category.tasks.map((task, taskIndex) => (
                    <div 
                      key={taskIndex}
                      className={`flex items-start p-3 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}
                    >
                      <div className="flex-shrink-0 mr-3 mt-0.5">
                        {getPriorityIcon(task.priority)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            defaultChecked={task.completed}
                          />
                          <span className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                            {task.task}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {tips && tips.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Pro Moving Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-center no-print">
            <div className="inline-flex items-center bg-green-50 text-green-800 px-6 py-3 rounded-lg">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span className="font-semibold">Ready to get started with your move?</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
