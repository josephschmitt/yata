import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { PrismaClient } from '@yata/db'

const app = new Hono()
const prisma = new PrismaClient()

app.use('*', logger())
app.use('*', cors())

const api = new Hono()

api.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() })
})

const syncSchema = z.object({
  lastPulledAt: z.string().optional(),
  changes: z.object({
    tasks: z.object({
      created: z.array(z.object({
        id: z.string(),
        title: z.string(),
        content: z.string().optional(),
        status: z.string(),
        section: z.string(),
        order: z.number(),
        urls: z.array(z.string()),
        dueDate: z.string().optional(),
        whenDate: z.string().optional(),
        startedDate: z.string().optional(),
        completedDate: z.string().optional(),
        userId: z.string(),
        projectId: z.string().optional(),
        typeId: z.string().optional(),
        parentId: z.string().optional(),
      })).optional(),
      updated: z.array(z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.string().optional(),
        status: z.string().optional(),
        section: z.string().optional(),
        order: z.number().optional(),
        urls: z.array(z.string()).optional(),
        dueDate: z.string().optional(),
        whenDate: z.string().optional(),
        startedDate: z.string().optional(),
        completedDate: z.string().optional(),
        projectId: z.string().optional(),
        typeId: z.string().optional(),
        parentId: z.string().optional(),
      })).optional(),
      deleted: z.array(z.string()).optional(),
    }).optional(),
    projects: z.object({
      created: z.array(z.object({
        id: z.string(),
        name: z.string(),
        userId: z.string(),
      })).optional(),
      updated: z.array(z.object({
        id: z.string(),
        name: z.string().optional(),
      })).optional(),
      deleted: z.array(z.string()).optional(),
    }).optional(),
    taskTypes: z.object({
      created: z.array(z.object({
        id: z.string(),
        name: z.string(),
        icon: z.string(),
        userId: z.string(),
      })).optional(),
      updated: z.array(z.object({
        id: z.string(),
        name: z.string().optional(),
        icon: z.string().optional(),
      })).optional(),
      deleted: z.array(z.string()).optional(),
    }).optional(),
  }).optional(),
})

api.post('/sync', zValidator('json', syncSchema), async (c) => {
  const { lastPulledAt, changes } = c.req.valid('json')
  
  try {
    const lastPulled = lastPulledAt ? new Date(lastPulledAt) : new Date(0)
    
    if (changes) {
      if (changes.tasks) {
        if (changes.tasks.created) {
          for (const task of changes.tasks.created) {
            await prisma.task.create({
              data: {
                ...task,
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
                whenDate: task.whenDate ? new Date(task.whenDate) : null,
                startedDate: task.startedDate ? new Date(task.startedDate) : null,
                completedDate: task.completedDate ? new Date(task.completedDate) : null,
              }
            })
          }
        }
        
        if (changes.tasks.updated) {
          for (const task of changes.tasks.updated) {
            const { id, ...updateData } = task
            
            const processedData = {
              ...updateData,
              dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
              whenDate: updateData.whenDate ? new Date(updateData.whenDate) : undefined,
              startedDate: updateData.startedDate ? new Date(updateData.startedDate) : undefined,
              completedDate: updateData.completedDate ? new Date(updateData.completedDate) : undefined,
            }
            
            await prisma.task.update({
              where: { id },
              data: processedData
            })
          }
        }
        
        if (changes.tasks.deleted) {
          await prisma.task.deleteMany({
            where: { id: { in: changes.tasks.deleted } }
          })
        }
      }
      
      if (changes.projects) {
        if (changes.projects.created) {
          for (const project of changes.projects.created) {
            await prisma.project.create({ data: project })
          }
        }
        
        if (changes.projects.updated) {
          for (const project of changes.projects.updated) {
            const { id, ...updateData } = project
            
            await prisma.project.update({
              where: { id },
              data: updateData
            })
          }
        }
        
        if (changes.projects.deleted) {
          await prisma.project.deleteMany({
            where: { id: { in: changes.projects.deleted } }
          })
        }
      }
      
      if (changes.taskTypes) {
        if (changes.taskTypes.created) {
          for (const taskType of changes.taskTypes.created) {
            await prisma.taskType.create({ data: taskType })
          }
        }
        
        if (changes.taskTypes.updated) {
          for (const taskType of changes.taskTypes.updated) {
            const { id, ...updateData } = taskType
            
            await prisma.taskType.update({
              where: { id },
              data: updateData
            })
          }
        }
        
        if (changes.taskTypes.deleted) {
          await prisma.taskType.deleteMany({
            where: { id: { in: changes.taskTypes.deleted } }
          })
        }
      }
    }
    
    const [updatedTasks, updatedProjects, updatedTaskTypes] = await Promise.all([
      prisma.task.findMany({
        where: { updatedAt: { gt: lastPulled } }
      }),
      prisma.project.findMany({
        where: { updatedAt: { gt: lastPulled } }
      }),
      prisma.taskType.findMany({
        where: { updatedAt: { gt: lastPulled } }
      })
    ])
    
    return c.json({
      changes: {
        tasks: {
          created: updatedTasks.filter(task => task.createdAt > lastPulled),
          updated: updatedTasks.filter(task => task.createdAt <= lastPulled)
        },
        projects: {
          created: updatedProjects.filter(project => project.createdAt > lastPulled),
          updated: updatedProjects.filter(project => project.createdAt <= lastPulled)
        },
        taskTypes: {
          created: updatedTaskTypes.filter(taskType => taskType.createdAt > lastPulled),
          updated: updatedTaskTypes.filter(taskType => taskType.createdAt <= lastPulled)
        }
      }
    })
  } catch (error) {
    console.error('Sync error:', error)
    return c.json({ error: 'Sync failed' }, 500)
  }
})

const taskSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  status: z.string(),
  section: z.string(),
  order: z.number(),
  urls: z.array(z.string()).default([]),
  dueDate: z.string().optional(),
  whenDate: z.string().optional(),
  startedDate: z.string().optional(),
  completedDate: z.string().optional(),
  projectId: z.string().optional(),
  typeId: z.string().optional(),
  parentId: z.string().optional(),
})

const updateTaskSchema = taskSchema.partial()

api.get('/tasks', async (c) => {
  const userId = c.req.header('x-user-id')
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const tasks = await prisma.task.findMany({
    where: { userId },
    include: {
      project: true,
      type: true,
      parent: true,
      subtasks: true,
    }
  })
  
  return c.json(tasks)
})

api.post('/tasks', zValidator('json', taskSchema), async (c) => {
  const userId = c.req.header('x-user-id')
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const data = c.req.valid('json')
  
  const task = await prisma.task.create({
    data: {
      ...data,
      userId,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      whenDate: data.whenDate ? new Date(data.whenDate) : null,
      startedDate: data.startedDate ? new Date(data.startedDate) : null,
      completedDate: data.completedDate ? new Date(data.completedDate) : null,
    },
    include: {
      project: true,
      type: true,
      parent: true,
      subtasks: true,
    }
  })
  
  return c.json(task, 201)
})

api.get('/tasks/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const task = await prisma.task.findFirst({
    where: { id, userId },
    include: {
      project: true,
      type: true,
      parent: true,
      subtasks: true,
    }
  })
  
  if (!task) {
    return c.json({ error: 'Task not found' }, 404)
  }
  
  return c.json(task)
})

api.put('/tasks/:id', zValidator('json', updateTaskSchema), async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const data = c.req.valid('json')
  
  try {
    const task = await prisma.task.update({
      where: { id, userId },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        whenDate: data.whenDate ? new Date(data.whenDate) : undefined,
        startedDate: data.startedDate ? new Date(data.startedDate) : undefined,
        completedDate: data.completedDate ? new Date(data.completedDate) : undefined,
      },
      include: {
        project: true,
        type: true,
        parent: true,
        subtasks: true,
      }
    })
    
    return c.json(task)
  } catch (error) {
    return c.json({ error: 'Task not found' }, 404)
  }
})

api.delete('/tasks/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  try {
    await prisma.task.delete({
      where: { id, userId }
    })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Task not found' }, 404)
  }
})

const reorderSchema = z.array(z.object({
  id: z.string(),
  section: z.string(),
  order: z.number(),
}))

api.post('/tasks/reorder', zValidator('json', reorderSchema), async (c) => {
  const userId = c.req.header('x-user-id')
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const updates = c.req.valid('json')
  
  try {
    await prisma.$transaction(
      updates.map(update => 
        prisma.task.update({
          where: { id: update.id, userId },
          data: {
            section: update.section,
            order: update.order,
          }
        })
      )
    )
    
    return c.json({ success: true })
  } catch (error) {
    console.error('Reorder error:', error)
    return c.json({ error: 'Reorder failed' }, 500)
  }
})

const projectSchema = z.object({
  name: z.string(),
})

api.get('/projects', async (c) => {
  const userId = c.req.header('x-user-id')
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const projects = await prisma.project.findMany({
    where: { userId },
    include: {
      tasks: true,
    }
  })
  
  return c.json(projects)
})

api.post('/projects', zValidator('json', projectSchema), async (c) => {
  const userId = c.req.header('x-user-id')
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const data = c.req.valid('json')
  
  const project = await prisma.project.create({
    data: {
      ...data,
      userId,
    },
    include: {
      tasks: true,
    }
  })
  
  return c.json(project, 201)
})

api.get('/projects/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const project = await prisma.project.findFirst({
    where: { id, userId },
    include: {
      tasks: true,
    }
  })
  
  if (!project) {
    return c.json({ error: 'Project not found' }, 404)
  }
  
  return c.json(project)
})

api.put('/projects/:id', zValidator('json', projectSchema), async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const data = c.req.valid('json')
  
  try {
    const project = await prisma.project.update({
      where: { id, userId },
      data,
      include: {
        tasks: true,
      }
    })
    
    return c.json(project)
  } catch (error) {
    return c.json({ error: 'Project not found' }, 404)
  }
})

api.delete('/projects/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  try {
    await prisma.project.delete({
      where: { id, userId }
    })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Project not found' }, 404)
  }
})

const taskTypeSchema = z.object({
  name: z.string(),
  icon: z.string(),
})

api.get('/types', async (c) => {
  const userId = c.req.header('x-user-id')
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const taskTypes = await prisma.taskType.findMany({
    where: { userId },
    include: {
      tasks: true,
    }
  })
  
  return c.json(taskTypes)
})

api.post('/types', zValidator('json', taskTypeSchema), async (c) => {
  const userId = c.req.header('x-user-id')
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const data = c.req.valid('json')
  
  const taskType = await prisma.taskType.create({
    data: {
      ...data,
      userId,
    },
    include: {
      tasks: true,
    }
  })
  
  return c.json(taskType, 201)
})

api.get('/types/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const taskType = await prisma.taskType.findFirst({
    where: { id, userId },
    include: {
      tasks: true,
    }
  })
  
  if (!taskType) {
    return c.json({ error: 'Task type not found' }, 404)
  }
  
  return c.json(taskType)
})

api.put('/types/:id', zValidator('json', taskTypeSchema), async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  const data = c.req.valid('json')
  
  try {
    const taskType = await prisma.taskType.update({
      where: { id, userId },
      data,
      include: {
        tasks: true,
      }
    })
    
    return c.json(taskType)
  } catch (error) {
    return c.json({ error: 'Task type not found' }, 404)
  }
})

api.delete('/types/:id', async (c) => {
  const id = c.req.param('id')
  const userId = c.req.header('x-user-id')
  
  if (!userId) {
    return c.json({ error: 'User ID required' }, 401)
  }
  
  try {
    await prisma.taskType.delete({
      where: { id, userId }
    })
    
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Task type not found' }, 404)
  }
})

app.route('/api/v1', api)

const port = process.env.PORT || 3001

console.log(`Server is running on port ${port}`)

export default {
  port,
  fetch: app.fetch,
}