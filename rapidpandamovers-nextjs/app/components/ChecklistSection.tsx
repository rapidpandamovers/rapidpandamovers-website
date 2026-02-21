'use client'

import { useState, useRef } from 'react'
import { Link } from '@/i18n/routing'
import { CheckCircle, Clock, AlertCircle, Info, Printer, ClipboardList, ArrowRight, Calendar, Download } from 'lucide-react'
import { useMessages } from 'next-intl'
import { resolveIcon } from '@/lib/icons'
import { H1, H2, H3 } from '@/app/components/Heading'

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

interface ChecklistSectionProps {
  title?: string
  subtitle?: string
  categories?: ChecklistCategory[]
  showPrintButton?: boolean
  variant?: 'full' | 'preview'
  className?: string
}

export default function ChecklistSection({
  title = 'Moving Checklist',
  subtitle,
  categories = [],
  showPrintButton = false,
  variant = 'preview',
  className = ''
}: ChecklistSectionProps) {
  const { ui, content } = useMessages() as any
  const phone = content.site.phone
  const phoneFormatted = `(${phone.slice(0,3)}) ${phone.slice(4,7)}-${phone.slice(8)}`
  // Track checked state for each task
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {}
    categories.forEach((cat, catIdx) => {
      cat.tasks.forEach((task, taskIdx) => {
        initial[`${catIdx}-${taskIdx}`] = task.completed
      })
    })
    return initial
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const pdfContentRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPDF = async () => {
    if (isGenerating || !pdfContentRef.current) return
    setIsGenerating(true)

    try {
      // Dynamic imports to avoid SSR issues
      const html2canvas = (await import('html2canvas-pro')).default
      const { jsPDF } = await import('jspdf')

      const element = pdfContentRef.current

      // Create PDF (letter size)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
      })

      const marginPt = 36
      const contentWidthPt = 612 - (marginPt * 2)

      // Helper to render element to canvas
      const renderToCanvas = async (el: HTMLElement) => {
        return html2canvas(el, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        })
      }

      // Helper to add canvas to PDF
      const addToPdf = (canvas: HTMLCanvasElement, yPos: number) => {
        const scale = contentWidthPt / canvas.width
        const height = canvas.height * scale
        pdf.addImage(
          canvas.toDataURL('image/jpeg', 0.92),
          'JPEG',
          marginPt,
          yPos,
          contentWidthPt,
          height
        )
        return height
      }

      // Clone and set up for PDF rendering
      const clone = element.cloneNode(true) as HTMLElement
      clone.classList.add('generating-pdf')
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      clone.style.top = '0'
      clone.style.width = '720px'
      clone.style.backgroundColor = '#ffffff'
      document.body.appendChild(clone)

      await new Promise(resolve => setTimeout(resolve, 100))

      // Get sections
      const header = clone.querySelector('.pdf-header') as HTMLElement
      const grid = clone.querySelector('.grid') as HTMLElement
      const cards = grid ? Array.from(grid.querySelectorAll('.checklist-card')) as HTMLElement[] : []
      const footer = clone.querySelector('.pdf-footer') as HTMLElement

      let currentY = marginPt

      // Render header
      if (header) {
        const headerCanvas = await renderToCanvas(header)
        currentY += addToPdf(headerCanvas, currentY) + 15
      }

      // Render cards in groups of 4 (2 rows of 2)
      const cardsPerPage = 4

      for (let i = 0; i < cards.length; i += cardsPerPage) {
        if (i > 0) {
          pdf.addPage()
          currentY = marginPt
        }

        // Create a container for this group of cards
        const groupContainer = document.createElement('div')
        groupContainer.style.display = 'grid'
        groupContainer.style.gridTemplateColumns = '1fr 1fr'
        groupContainer.style.gap = '10px'
        groupContainer.style.width = '100%'
        groupContainer.style.backgroundColor = '#ffffff'
        groupContainer.classList.add('generating-pdf')

        // Add cards to this group
        const endIndex = Math.min(i + cardsPerPage, cards.length)
        for (let j = i; j < endIndex; j++) {
          const cardClone = cards[j].cloneNode(true) as HTMLElement
          groupContainer.appendChild(cardClone)
        }

        clone.appendChild(groupContainer)
        await new Promise(resolve => setTimeout(resolve, 50))

        const groupCanvas = await renderToCanvas(groupContainer)
        currentY += addToPdf(groupCanvas, currentY)

        clone.removeChild(groupContainer)
      }

      // Render footer
      if (footer) {
        const footerCanvas = await renderToCanvas(footer)
        const footerHeight = (footerCanvas.height * contentWidthPt) / footerCanvas.width
        addToPdf(footerCanvas, 792 - marginPt - footerHeight)
      }

      // Clean up
      document.body.removeChild(clone)

      pdf.save('rapid-panda-movers-moving-checklist.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      window.print()
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleTask = (catIdx: number, taskIdx: number) => {
    setCheckedTasks(prev => ({
      ...prev,
      [`${catIdx}-${taskIdx}`]: !prev[`${catIdx}-${taskIdx}`]
    }))
  }

  const getCategoryProgress = (catIdx: number, tasks: Task[]) => {
    const completed = tasks.filter((_, taskIdx) => checkedTasks[`${catIdx}-${taskIdx}`]).length
    return { completed, total: tasks.length, percentage: Math.round((completed / tasks.length) * 100) }
  }

  const getTotalProgress = () => {
    const allTasks = categories.flatMap((cat, catIdx) =>
      cat.tasks.map((_, taskIdx) => checkedTasks[`${catIdx}-${taskIdx}`])
    )
    const completed = allTasks.filter(Boolean).length
    return { completed, total: allTasks.length, percentage: Math.round((completed / allTasks.length) * 100) || 0 }
  }

  const getPriorityOrder = (priority: string): number => {
    switch (priority) {
      case 'high': return 0
      case 'medium': return 1
      case 'low': return 2
      default: return 3
    }
  }

  const sortTasksByPriority = (tasks: Task[]): (Task & { originalIndex: number })[] => {
    return tasks
      .map((task, index) => ({ ...task, originalIndex: index }))
      .sort((a, b) => getPriorityOrder(a.priority) - getPriorityOrder(b.priority))
  }

  const getPriorityBadge = (priority: string, forPrint = false) => {
    const baseClass = forPrint
      ? 'priority-badge'
      : 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium'

    switch (priority) {
      case 'high':
        return (
          <span className={`${baseClass} ${forPrint ? 'priority-high' : 'bg-red-100 text-red-700'}`}>
            {!forPrint && <AlertCircle className="w-3 h-3 mr-1" />}
            {ui.checklist.priority.high}
          </span>
        )
      case 'medium':
        return (
          <span className={`${baseClass} ${forPrint ? 'priority-medium' : 'bg-yellow-100 text-yellow-700'}`}>
            {!forPrint && <Clock className="w-3 h-3 mr-1" />}
            {ui.checklist.priority.medium}
          </span>
        )
      case 'low':
        return (
          <span className={`${baseClass} ${forPrint ? 'priority-low' : 'bg-orange-100 text-orange-700'}`}>
            {!forPrint && <Info className="w-3 h-3 mr-1" />}
            {ui.checklist.priority.low}
          </span>
        )
      default:
        return null
    }
  }

  // Preview variant - shows a simple preview with link to full checklist
  if (variant === 'preview') {
    const features = ui.checklist.features.map((f: any) => ({
      icon: resolveIcon(f.icon),
      title: f.title,
      desc: f.desc,
    }))

    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <H2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              {ui.checklist.previewTitle}
            </H2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {ui.checklist.previewSubtitle}
            </p>
          </div>

          <div className="bg-orange-50 rounded-4xl p-8">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {features.map((feature: any, index: number) => {
                const IconComponent = feature.icon
                return (
                  <div key={index} className="bg-white rounded-2xl p-6 text-center">
                    <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="w-7 h-7 text-orange-500" />
                    </div>
                    <H3 className="font-bold text-gray-800 mb-1">{feature.title}</H3>
                    <p className="text-sm text-gray-600">{feature.desc}</p>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                href="/moving-checklist"
                className="inline-flex items-center bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-shadow-sm"
              >
                {ui.buttons.viewFullChecklist}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Full variant - shows the complete interactive checklist
  const totalProgress = getTotalProgress()

  return (
    <section className={`pt-20 print:py-0 ${className}`}>
      <div className="container mx-auto print:max-w-none">
        {/* PDF Content Wrapper */}
        <div ref={pdfContentRef} className="pdf-content">
          {/* PDF/Print Header - Only visible when printing or generating PDF */}
          <div className="hidden print:block pdf-header mb-6 pb-4 border-b-2 border-gray-300">
          <div className="flex justify-between items-start">
            <div>
              <H1 className="text-2xl font-bold text-gray-900">{ui.checklist.printHeader.company}</H1>
              <p className="text-sm text-gray-600">{ui.checklist.printHeader.title}</p>
            </div>
            <div className="text-right text-sm text-gray-600">
              <p>{ui.checklist.printLabels.name} ____________________</p>
              <p className="mt-1">{ui.checklist.printLabels.movingDate} ____________________</p>
            </div>
          </div>
          <div className="mt-4 flex gap-6 text-xs">
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 bg-red-200 border border-red-400 rounded mr-1"></span>
              {ui.checklist.priorityLabels.high}
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 bg-yellow-200 border border-yellow-400 rounded mr-1"></span>
              {ui.checklist.priorityLabels.medium}
            </span>
            <span className="flex items-center">
              <span className="inline-block w-3 h-3 bg-orange-200 border border-orange-400 rounded mr-1"></span>
              {ui.checklist.priorityLabels.low}
            </span>
          </div>
        </div>

        {/* Screen Header - Hidden when printing */}
        <div className="no-print mb-12 space-y-6">

          {/* Progress + Actions Card */}
          <div className="bg-gray-50 rounded-4xl p-8 md:p-10">
            {/* Progress */}
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-bold text-gray-800">{ui.checklist.progress} {totalProgress.percentage}%</span>
              <span className="text-sm text-gray-500 font-medium">{totalProgress.completed} {ui.checklist.of} {totalProgress.total} {ui.checklist.tasks}</span>
            </div>
            <div className="h-4 bg-white rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${totalProgress.percentage}%` }}
              />
            </div>

            {/* Actions */}
            {showPrintButton && (
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  className="inline-flex items-center px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-shadow-sm"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isGenerating ? ui.buttons.generating : ui.buttons.downloadPdf}
                </button>
                <button
                  onClick={handlePrint}
                  className="inline-flex items-center px-5 py-2.5 border-2 border-orange-700 text-orange-700 hover:bg-orange-600 hover:text-white font-semibold rounded-lg transition-colors"
                >
                  <Printer className="w-5 h-5 mr-2" />
                  {ui.buttons.print}
                </button>
              </div>
            )}

            {/* Priority Legend */}
            <div className="flex flex-wrap justify-center gap-3 pt-6 border-t border-gray-200">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                <AlertCircle className="w-3 h-3 mr-1" />
                {ui.checklist.priority.highLabel}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
                <Clock className="w-3 h-3 mr-1" />
                {ui.checklist.priority.medium}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                <Info className="w-3 h-3 mr-1" />
                {ui.checklist.priority.lowLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        {categories.length > 0 && (
          <div className="print:bg-transparent print:p-0 print:rounded-none">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:gap-4 print:grid-cols-2">
            {categories.map((category, categoryIndex) => {
              const progress = getCategoryProgress(categoryIndex, category.tasks)
              return (
                <div
                  key={categoryIndex}
                  className="checklist-card bg-white rounded-4xl overflow-hidden border border-gray-50 print:shadow-none print:rounded-lg"
                >
                  {/* Category Header */}
                  <div className="checklist-header bg-gray-50 p-6 print:p-3 border-b border-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div>
                          <H3 className="text-lg font-bold text-gray-800 print:text-base">
                            {category.title}
                          </H3>
                          <p className="text-sm text-gray-500 print:text-xs">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Category Progress - Screen only */}
                    <div className="mt-4 no-print">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>{progress.completed} {ui.checklist.of} {progress.total} {ui.checklist.complete}</span>
                        <span className="font-medium text-orange-700">{progress.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full transition-all duration-300"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tasks List */}
                  <div className="p-6 print:p-2">
                    <div className="space-y-2 print:space-y-1">
                      {sortTasksByPriority(category.tasks).map((task) => {
                        const isChecked = checkedTasks[`${categoryIndex}-${task.originalIndex}`]
                        return (
                          <label
                            key={task.originalIndex}
                            className={`checklist-task flex items-center p-3 print:p-2 rounded-lg cursor-pointer transition-all print:cursor-default ${
                              isChecked
                                ? 'bg-green-50 border border-green-200 print:bg-white'
                                : 'bg-white border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTask(categoryIndex, task.originalIndex)}
                              className="sr-only"
                            />
                            {/* Screen Checkbox */}
                            <div className={`screen-checkbox w-5 h-5 rounded border-2 flex items-center justify-center mr-3 flex-shrink-0 transition-colors no-print ${
                              isChecked
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}>
                              {isChecked && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            {/* Print Checkbox */}
                            <span className={`hidden print:inline-block print-checkbox ${isChecked ? 'print-checkbox-checked' : ''}`}></span>
                            <span className={`flex-1 text-sm print:text-xs ${
                              isChecked ? 'text-gray-500 line-through print:text-gray-700 print:no-underline' : 'text-gray-700'
                            }`}>
                              {task.task}
                            </span>
                            {/* Screen Priority Badge */}
                            <div className="ml-2 flex-shrink-0 no-print">
                              {getPriorityBadge(task.priority)}
                            </div>
                            {/* Print Priority Badge */}
                            <div className="print-priority-badge hidden print:block ml-2 flex-shrink-0">
                              {getPriorityBadge(task.priority, true)}
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        )}

          {/* Print Footer */}
          <div className="hidden print:block pdf-footer mt-6 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
            <p>Rapid Panda Movers • {phoneFormatted} • www.rapidpandamovers.com</p>
            <p className="mt-1">{ui.checklist.printFooter}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
