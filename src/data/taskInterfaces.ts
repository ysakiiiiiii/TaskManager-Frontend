// interfaces.ts
export interface TaskStatus {
  id: number;
  name: string;
}

export interface TaskItem {
  id: number;
  title: string;
  description: string;
  statusId: number;
  status: TaskStatus;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  isActive: boolean;
  role: string;
  tasks: TaskItem[];
}


export interface TeamDashboardProps {
  viewMode?: 'card' | 'list';
}

export const statusLabels: Record<number, string> = {
  1: "To Do",
  2: "In Progress",
  3: "On Hold",
  4: "Done"
};

export const teamMembers: User[] = [
  {
    id: "1",
    firstName: "Dustin",
    lastName: "Smith",
    username: "dustin.smith",
    email: "dustin@timetoprogram.com",
    isActive: true,
    role: "Developer",
    tasks: [
      { id: 1, title: "Fix bug", description: "Resolve login issue", statusId: 2, status: { id: 2, name: "In Progress" } },
      { id: 2, title: "Add feature", description: "Implement auth", statusId: 3, status: { id: 3, name: "Done" } },
      { id: 5, title: "Code review", description: "Review PR #42", statusId: 1, status: { id: 1, name: "To Do" } }
    ]
  },
  {
    id: "2",
    firstName: "Mary",
    lastName: "Jane",
    username: "mary.jane",
    email: "mary@timetoprogram.com",
    isActive: false,
    role: "Designer",
    tasks: [
      { id: 3, title: "UI Review", description: "Review dashboard UI", statusId: 1, status: { id: 1, name: "To Do" } },
      { id: 4, title: "Icon Set", description: "Design new icons", statusId: 4, status: { id: 4, name: "On Hold" } }
    ]
  },
  {
    id: "3",
    firstName: "Alex",
    lastName: "Johnson",
    username: "alex.johnson",
    email: "alex@timetoprogram.com",
    isActive: true,
    role: "Product Manager",
    tasks: [
      { id: 6, title: "Roadmap", description: "Update Q3 roadmap", statusId: 2, status: { id: 2, name: "In Progress" } },
      { id: 7, title: "User research", description: "Conduct interviews", statusId: 3, status: { id: 3, name: "Done" } },
      { id: 8, title: "Metrics", description: "Analyze KPIs", statusId: 1, status: { id: 1, name: "To Do" } }
    ]
  },

  // Additional 20 mock team members with usernames
  ...Array.from({ length: 20 }, (_, i) => {
    const id = (i + 4).toString();
    const firstNames = ["John", "Sara", "Mike", "Linda", "Robert", "Emily", "James", "Sophie", "David", "Nina"];
    const lastNames = ["Taylor", "Brown", "Wilson", "Lee", "Martin", "Clark", "Hall", "Allen", "Young", "King"];
    const roles = ["Developer", "Designer", "Product Manager", "QA Tester"];
    const statuses = [1, 2, 3, 4];

    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const email = `${username}@timetoprogram.com`;
    const role = roles[i % roles.length];
    const isActive = i % 2 === 0;

    const tasks: TaskItem[] = Array.from({ length: 3 }, (_, j) => {
      const statusId = statuses[(i + j) % statuses.length];
      return {
        id: i * 10 + j + 10,
        title: `Task ${j + 1}`,
        description: `Description for task ${j + 1}`,
        statusId,
        status: { id: statusId, name: statusLabels[statusId] }
      };
    });

    return {
      id,
      firstName,
      lastName,
      username,
      email,
      isActive,
      role,
      tasks
    };
  })
];
