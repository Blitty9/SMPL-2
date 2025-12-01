import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "../../lib/utils/cn";

export function ExampleTransformation() {
  const [activeTab, setActiveTab] = useState("input");

  const tabs = [
    { id: "input", label: "Input" },
    { id: "json", label: "JSON Schema" },
    { id: "dsl", label: "SMPL DSL" },
    { id: "expanded", label: "Expanded" },
    { id: "export", label: "Export Prompt" },
  ];

  const examples = {
    input: `Build a task management app with:
- User authentication
- Create, edit, delete tasks
- Assign tasks to team members
- Real-time updates
- Priority levels and due dates`,
    json: `{
  "app": {
    "name": "TaskManager",
    "type": "web",
    "features": [
      {
        "name": "Authentication",
        "methods": ["email", "password"],
        "includes": ["signup", "login", "logout"]
      },
      {
        "name": "TaskManagement",
        "operations": ["create", "read", "update", "delete"],
        "fields": {
          "title": "string",
          "description": "text",
          "priority": "enum[low,medium,high]",
          "dueDate": "datetime",
          "assignedTo": "ref:User"
        }
      },
      {
        "name": "RealTimeSync",
        "protocol": "websocket",
        "events": ["task.created", "task.updated"]
      }
    ]
  }
}`,
    dsl: `app TaskManager web
  auth email+pwd [signup,login,logout]

  model Task
    title:str!
    desc:text
    priority:enum(low,med,high)
    due:dt
    assignee->User

  crud Task [create,read,update,delete]

  realtime ws [task.created,task.updated]

  ui
    /tasks list+create
    /tasks/:id detail+edit`,
    expanded: `# TaskManager Application Specification

## Overview
A real-time task management application with team collaboration features.

## Authentication System
- Method: Email & Password
- Features:
  * User signup with email verification
  * Secure login with session management
  * Logout with token invalidation

## Data Models

### Task
- **title**: String, required
  - Max length: 200 characters
  - User-facing task name

- **description**: Text, optional
  - Rich text support for detailed task information

- **priority**: Enum (low, medium, high)
  - Default: medium
  - Determines task urgency

- **dueDate**: DateTime, optional
  - ISO 8601 format
  - Enables deadline tracking

- **assignedTo**: Reference to User
  - Single assignee per task
  - Supports reassignment

## Features

### Task Management (CRUD)
- Create: Authenticated users can create tasks
- Read: View individual tasks and task lists
- Update: Edit task properties
- Delete: Soft delete with archive option

### Real-Time Synchronization
- Protocol: WebSocket
- Events:
  * task.created: Broadcast new tasks
  * task.updated: Sync changes across clients

## User Interface Routes
- /tasks: List view with inline creation
- /tasks/:id: Detailed task view with edit mode`,
    export: `You are building a task management web application. Here's the complete specification:

**Core Requirements:**
1. Implement email/password authentication with signup, login, and logout
2. Create a Task model with: title (string, required), description (text), priority (enum: low/medium/high), dueDate (datetime), assignedTo (User reference)
3. Build full CRUD operations for tasks (create, read, update, delete)
4. Implement real-time synchronization using WebSocket for task.created and task.updated events
5. Create two main routes:
   - /tasks: List view with inline task creation
   - /tasks/:id: Detailed view with edit capabilities

**Technical Stack:**
- Frontend: React with TypeScript
- Backend: Node.js with Express
- Database: PostgreSQL
- Real-time: Socket.io
- Auth: JWT tokens

**Implementation Notes:**
- Use row-level security for multi-tenant data isolation
- Implement optimistic UI updates for better UX
- Add input validation on both client and server
- Include loading states and error handling
- Ensure responsive design for mobile devices

Start with the authentication system, then build the Task model and CRUD operations. Finally, integrate real-time functionality.`,
  };

  return (
    <section className="py-20 bg-deep-black relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">
            See the <span className="text-[#C8B3FF]">Transformation</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Watch how SMPL transforms a simple idea into multiple AI-ready formats
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-[#1A1D21] rounded-lg border border-[#2F333A]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  activeTab === tab.id
                    ? "bg-[#C8B3FF]/20 text-[#C8B3FF] border border-[#C8B3FF]/30"
                    : "text-neutral-400 hover:text-white hover:bg-[#2F333A]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="bg-[#1A1D21] rounded-lg border border-[#2F333A] overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-[#0A0A0A] border-b border-[#2F333A]">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-2 text-xs text-neutral-500">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </span>
              </div>
              <pre className="p-6 overflow-x-auto">
                <code className="text-sm text-neutral-300 font-jetbrains leading-relaxed">
                  {examples[activeTab as keyof typeof examples]}
                </code>
              </pre>
            </div>
          </motion.div>

          <div className="mt-8 flex items-center justify-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C8B3FF]" />
              <span>Single source input</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C8B3FF]" />
              <span>Multiple format outputs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C8B3FF]" />
              <span>Zero information loss</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
