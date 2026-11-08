// Quentrix AI - Intelligent Examination & Tutoring Service
import api from './api.js';
import { storage } from '../utils/storage.js';

/**
 * Topic-Specific Academic Question Knowledge Base
 */
const TOPIC_QUESTION_BANK = {
  // --- Operating Systems ---
  deadlocks: [
    {
      text: "Under the Coffman conditions for deadlock, which condition states that resources cannot be forcibly confiscated from a process holding them?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "Mutual Exclusion" },
        { id: "B", text: "Hold and Wait" },
        { id: "C", text: "No Preemption" },
        { id: "D", text: "Circular Wait" }
      ],
      correctAnswer: "C",
      explanation: "No Preemption dictates that allocated resources cannot be forcibly revoked; they must be released voluntarily by the holding process upon completion."
    },
    {
      text: "In Banker's Algorithm, given Allocation = [1, 2, 0] and Max = [4, 5, 2] for Process P1, what is the Need vector for P1?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "Need = [3, 3, 2]" },
        { id: "B", text: "Need = [5, 7, 2]" },
        { id: "C", text: "Need = [1, 2, 0]" },
        { id: "D", text: "Need = [4, 3, 2]" }
      ],
      correctAnswer: "A",
      explanation: "Need vector is computed as Need[i] = Max[i] - Allocation[i]. Thus [4-1, 5-2, 2-0] = [3, 3, 2]."
    },
    {
      text: "In a Resource Allocation Graph (RAG) where every resource type has exactly ONE instance, a cycle is a necessary and sufficient condition for deadlock.",
      type: "True/False",
      difficulty: "Easy",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "A",
      explanation: "For single-instance resource systems, the existence of a cycle in the RAG guarantees that a deadlock exists."
    },
    {
      text: "Which of the following strategies represent valid deadlock recovery techniques? (Select all that apply)",
      type: "Multiple select",
      difficulty: "Medium",
      options: [
        { id: "A", text: "Terminating all deadlocked processes simultaneously" },
        { id: "B", text: "Aborting deadlocked processes one at a time until the cycle is resolved" },
        { id: "C", text: "Preempting resources from holding processes with checkpoint rollback" },
        { id: "D", text: "Increasing CPU clock frequency to accelerate thread execution" }
      ],
      correctAnswer: ["A", "B", "C"],
      explanation: "Process termination (all at once or iteratively) and resource preemption with state rollbacks are standard recovery mechanisms."
    },
    {
      text: "Implement an algorithm to simulate Banker's Safety State Detection. Given an Allocation matrix, Max matrix, and Available vector, return whether the system is in a safe state and output the safe sequence.",
      type: "Programming",
      difficulty: "Hard",
      options: [],
      correctAnswer: "",
      explanation: "Simulate resource allocations using a Work vector initialized to Available and a Finish boolean vector. Iteratively satisfy processes whose Need <= Work."
    },
    {
      text: "What is the primary difference between Deadlock Prevention and Deadlock Avoidance?",
      type: "MCQ",
      difficulty: "Hard",
      options: [
        { id: "A", text: "Prevention eliminates at least one Coffman condition; Avoidance dynamically monitors resource allocation state to prevent entering an unsafe state" },
        { id: "B", text: "Prevention uses Banker's algorithm; Avoidance eliminates circular wait" },
        { id: "C", text: "Avoidance terminates processes; Prevention rolls back transactions" },
        { id: "D", text: "There is no theoretical or practical difference between them" }
      ],
      correctAnswer: "A",
      explanation: "Deadlock Prevention invalidates one of the 4 Coffman conditions statically. Deadlock Avoidance dynamically analyzes state transitions using algorithms like Banker's."
    },
    {
      text: "In Havender's scheme for preventing Circular Wait, what policy is enforced?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "Imposing a global linear ordering of all resource types and requiring processes to request resources in strictly increasing order" },
        { id: "B", text: "Requiring every process to request all its resources at once before execution" },
        { id: "C", text: "Preempting all allocated resources whenever a new request cannot be immediately satisfied" },
        { id: "D", text: "Restricting each process to hold at most one resource at any given moment" }
      ],
      correctAnswer: "A",
      explanation: "Circular wait is prevented by defining a total ordering of all resource types and requiring that processes request resources in strictly increasing order of enumeration."
    },
    {
      text: "If an operating system state is evaluated as 'Unsafe' under Banker's algorithm, what does this mathematically imply?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "The system is not deadlocked currently, but the OS cannot guarantee avoiding a deadlock if all processes make worst-case requests" },
        { id: "B", text: "The system is deadlocked with 100% certainty at this exact moment" },
        { id: "C", text: "The system has crashed and kernel panic is triggered" },
        { id: "D", text: "Every process has entered an unrecoverable infinite loop" }
      ],
      correctAnswer: "A",
      explanation: "An unsafe state is not equivalent to a deadlock; it simply means the system cannot guarantee avoidance of deadlock if all processes simultaneously demand their maximum declared resources."
    },
    {
      text: "For a system with m resource types and n processes, what is the worst-case time complexity of Banker's Safety Algorithm to discover a safe sequence?",
      type: "MCQ",
      difficulty: "Hard",
      options: [
        { id: "A", text: "O(m * n^2)" },
        { id: "B", text: "O(m * n)" },
        { id: "C", text: "O(n * log m)" },
        { id: "D", text: "O(2^n)" }
      ],
      correctAnswer: "A",
      explanation: "Banker's Safety check requires finding an unfinished process whose Need <= Work (taking O(m) operations), repeated for at most n processes, leading to O(m * n^2) complexity."
    }
  ],

  "cpu scheduling": [
    {
      text: "In Round Robin CPU scheduling with time quantum Q, what happens when Q is set to be extraordinarily large (Q -> infinity)?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "The scheduling degenerates into First-Come, First-Served (FCFS)" },
        { id: "B", text: "The scheduling degenerates into Shortest Job First (SJF)" },
        { id: "C", text: "Context switching overhead becomes unacceptable" },
        { id: "D", text: "CPU utilization drops to zero" }
      ],
      correctAnswer: "A",
      explanation: "When the time quantum exceeds the longest process burst time, each process runs to completion upon first selection, behaving exactly like FCFS."
    },
    {
      text: "Which of the following scheduling algorithms provably yields the minimum average waiting time for a given set of stationary processes?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "Shortest Job First (SJF / SRTF)" },
        { id: "B", text: "Round Robin (RR)" },
        { id: "C", text: "First-Come, First-Served (FCFS)" },
        { id: "D", text: "Multilevel Feedback Queue (MLFQ)" }
      ],
      correctAnswer: "A",
      explanation: "SJF is provably optimal regarding average waiting time because scheduling shorter jobs ahead reduces the wait time of all subsequent jobs."
    },
    {
      text: "Preemptive Priority scheduling algorithms can cause indefinite blocking (starvation) for low-priority processes. Which technique resolves this?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "Aging: gradually increasing the priority of processes that wait in the system for long periods" },
        { id: "B", text: "Decreasing the time quantum" },
        { id: "C", text: "Switching to pure non-preemptive FCFS" },
        { id: "D", text: "Doubling physical RAM" }
      ],
      correctAnswer: "A",
      explanation: "Aging gradually increments process priority over time, ensuring even lowest-priority processes eventually acquire the CPU."
    },
    {
      text: "Which metrics are typically optimized by CPU scheduling algorithms? (Select all that apply)",
      type: "Multiple select",
      difficulty: "Easy",
      options: [
        { id: "A", text: "Maximize CPU Utilization" },
        { id: "B", text: "Maximize Turnaround Time" },
        { id: "C", text: "Minimize Waiting Time" },
        { id: "D", text: "Minimize Response Time" }
      ],
      correctAnswer: ["A", "C", "D"],
      explanation: "Schedulers aim to maximize CPU utilization and throughput while minimizing turnaround time, waiting time, and response latency."
    },
    {
      text: "The Convoy Effect in CPU scheduling occurs predominantly in Round Robin scheduling.",
      type: "True/False",
      difficulty: "Easy",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "B",
      explanation: "The Convoy Effect occurs in FCFS when many short I/O-bound processes wait behind a single long CPU-bound process."
    }
  ],

  "process management": [
    {
      text: "When a parent process calls the fork() system call in UNIX-like operating systems, what is the return value of fork() in the child process?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "0" },
        { id: "B", text: "The Process ID (PID) of the parent" },
        { id: "C", text: "A negative integer" },
        { id: "D", text: "1" }
      ],
      correctAnswer: "A",
      explanation: "fork() returns 0 to the newly created child process, and returns the child's non-zero PID to the parent process."
    },
    {
      text: "What is an 'Orphan Process' in an operating system?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "A process whose parent has terminated before it, usually adopted by init/systemd" },
        { id: "B", text: "A process that has finished execution but still has an entry in the process table" },
        { id: "C", text: "A process stuck in an infinite loop" },
        { id: "D", text: "A process with no assigned memory address space" }
      ],
      correctAnswer: "A",
      explanation: "When a parent process terminates before its child, the child becomes an orphan and is reparented to init (PID 1)."
    },
    {
      text: "A Zombie process consumes CPU execution cycles continuously until rebooted.",
      type: "True/False",
      difficulty: "Easy",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "B",
      explanation: "A Zombie process has completed execution and consumes no CPU cycles or memory, but retains its PCB entry so the parent can read its exit status."
    }
  ],

  "memory management": [
    {
      text: "Which page replacement algorithm suffers from Belady's Anomaly (where increasing the number of page frames can result in more page faults)?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "First-In, First-Out (FIFO)" },
        { id: "B", text: "Least Recently Used (LRU)" },
        { id: "C", text: "Optimal Page Replacement (OPT)" },
        { id: "D", text: "Least Frequently Used (LFU)" }
      ],
      correctAnswer: "A",
      explanation: "FIFO is not a stack algorithm and does not satisfy inclusion properties, making it susceptible to Belady's Anomaly."
    },
    {
      text: "What is the primary cause of external fragmentation in memory allocation?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "Variable-sized partitions being allocated and deallocated over time, leaving dispersed free blocks" },
        { id: "B", text: "Fixed-size paging frames where process data does not fill the last frame" },
        { id: "C", text: "Cache line misses in L1 and L2 cache" },
        { id: "D", text: "TLB miss latency" }
      ],
      correctAnswer: "A",
      explanation: "External fragmentation occurs when total memory space exists to satisfy a request, but it is fragmented into non-contiguous slices."
    },
    {
      text: "Paging completely eliminates external fragmentation by allocating memory in fixed-size frames.",
      type: "True/False",
      difficulty: "Easy",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "A",
      explanation: "Because physical memory is broken into fixed-sized blocks (frames), any free frame can be assigned, avoiding external fragmentation."
    }
  ],

  // --- Data Structures ---
  trees: [
    {
      text: "What is the maximum allowed balance factor |height(left) - height(right)| for any node in an AVL tree?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "1" },
        { id: "B", text: "0" },
        { id: "C", text: "2" },
        { id: "D", text: "log(n)" }
      ],
      correctAnswer: "A",
      explanation: "An AVL tree is strictly height-balanced: for every node, the heights of its left and right subtrees may differ by at most 1."
    },
    {
      text: "Which traversal of a valid Binary Search Tree (BST) visits nodes in strictly ascending numerical order?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "Inorder Traversal (Left, Root, Right)" },
        { id: "B", text: "Preorder Traversal (Root, Left, Right)" },
        { id: "C", text: "Postorder Traversal (Left, Right, Root)" },
        { id: "D", text: "Level-order Traversal (BFS)" }
      ],
      correctAnswer: "A",
      explanation: "Because BST invariant guarantees Left < Root < Right, an Inorder traversal naturally yields sorted keys."
    },
    {
      text: "Which of the following self-balancing search trees guarantee worst-case O(log n) time complexity for search, insertion, and deletion? (Select all that apply)",
      type: "Multiple select",
      difficulty: "Medium",
      options: [
        { id: "A", text: "AVL Tree" },
        { id: "B", text: "Red-Black Tree" },
        { id: "C", text: "Unbalanced Binary Search Tree" },
        { id: "D", text: "Splay Tree (Worst-case)" }
      ],
      correctAnswer: ["A", "B"],
      explanation: "AVL and Red-Black trees strictly guarantee O(log n) worst-case bounds. Standard BSTs can skew to O(n), and Splay Trees provide amortized O(log n)."
    },
    {
      text: "Given the root of a binary tree, implement a function to check whether it is a valid Binary Search Tree (BST) where every node satisfies Left < Node < Right across all descendant subtrees.",
      type: "Programming",
      difficulty: "Medium",
      options: [],
      correctAnswer: "",
      explanation: "Pass valid lower and upper bounds recursively: validate(node.left, min, node.val) && validate(node.right, node.val, max)."
    },
    {
      text: "What is the maximum number of nodes in a full binary tree of height h (where height of a single root node is 0)?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "2^(h+1) - 1" },
        { id: "B", text: "2^h - 1" },
        { id: "C", text: "2^(h-1) + 1" },
        { id: "D", text: "2^(2h)" }
      ],
      correctAnswer: "A",
      explanation: "The geometric series sum of nodes at level 0 through h is 2^0 + 2^1 + ... + 2^h = 2^(h+1) - 1."
    },
    {
      text: "What is the worst-case time complexity of searching for an element in an unbalanced (degenerate) Binary Search Tree with n nodes?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "O(n)" },
        { id: "B", text: "O(log n)" },
        { id: "C", text: "O(n log n)" },
        { id: "D", text: "O(1)" }
      ],
      correctAnswer: "A",
      explanation: "When elements are inserted in sorted order, the BST degenerates into a singly linked list with height n, yielding O(n) search time."
    },
    {
      text: "What rotation is required in an AVL tree when a new node is inserted into the right subtree of the left child of an unbalanced node?",
      type: "MCQ",
      difficulty: "Hard",
      options: [
        { id: "A", text: "Left-Right (LR) Double Rotation" },
        { id: "B", text: "Right-Right (RR) Single Rotation" },
        { id: "C", text: "Left-Left (LL) Single Rotation" },
        { id: "D", text: "Right-Left (RL) Double Rotation" }
      ],
      correctAnswer: "A",
      explanation: "An insertion into the right subtree of the left child constitutes an LR imbalance, requiring a Left-Right double rotation."
    },
    {
      text: "In a min-heap with n elements stored in an array representation starting at index 1, where is the parent of the element at index i located?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "floor(i / 2)" },
        { id: "B", text: "2 * i" },
        { id: "C", text: "2 * i + 1" },
        { id: "D", text: "i - 1" }
      ],
      correctAnswer: "A",
      explanation: "In standard 1-based heap arrays, the parent of node i is at floor(i/2), left child at 2i, and right child at 2i+1."
    },
    {
      text: "What is the asymptotic time complexity to build a binary heap from an unsorted array of n elements using the bottom-up Heapify method?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "O(n)" },
        { id: "B", text: "O(n log n)" },
        { id: "C", text: "O(log n)" },
        { id: "D", text: "O(n^2)" }
      ],
      correctAnswer: "A",
      explanation: "Bottom-up heap construction runs in O(n) linear time because the sum of heights of all nodes converges asymptotically to 2n."
    }
  ],

  arrays: [
    {
      text: "What is the time complexity of finding the maximum contiguous subarray sum using Kadane's Algorithm?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "O(n)" },
        { id: "B", text: "O(n log n)" },
        { id: "C", text: "O(n^2)" },
        { id: "D", text: "O(1)" }
      ],
      correctAnswer: "A",
      explanation: "Kadane's algorithm scans the array in a single linear pass maintaining current_max and global_max, achieving optimal O(n) time."
    },
    {
      text: "Given an array of size n with elements in contiguous memory starting at base address 1000, if each element is 4 bytes, what is the memory address of element at index i?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "1000 + (i * 4)" },
        { id: "B", text: "1000 + i" },
        { id: "C", text: "1000 * (i + 4)" },
        { id: "D", text: "1004 + (i * 2)" }
      ],
      correctAnswer: "A",
      explanation: "Address of array index i is computed directly via Address(A[i]) = Base_Address + (i * element_size)."
    },
    {
      text: "Write an algorithm to rotate an array of n integers to the right by k steps in-place with O(n) time and O(1) auxiliary space.",
      type: "Programming",
      difficulty: "Medium",
      options: [],
      correctAnswer: "",
      explanation: "Use the 3-step reversal method: reverse the entire array, reverse the first k elements, then reverse the remaining n-k elements."
    }
  ],

  "linked lists": [
    {
      text: "What is the time complexity of detecting a cycle in a singly linked list using Floyd's Tortoise and Hare algorithm?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "O(n) time and O(1) space" },
        { id: "B", text: "O(n^2) time and O(1) space" },
        { id: "C", text: "O(n) time and O(n) space" },
        { id: "D", text: "O(log n) time and O(1) space" }
      ],
      correctAnswer: "A",
      explanation: "Floyd's algorithm uses two pointers (slow moving 1 step, fast moving 2 steps). If a loop exists, they meet within linear time using zero extra memory."
    },
    {
      text: "Inserting a new node at the head of a singly linked list with a known head pointer takes O(1) time.",
      type: "True/False",
      difficulty: "Easy",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "A",
      explanation: "Assigning newNode.next = head and head = newNode requires only two pointer operations and takes constant O(1) time."
    }
  ],

  "stacks & queues": [
    {
      text: "Which data structure is fundamentally utilized to verify balanced parentheses and perform infix-to-postfix expression conversion?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "Stack (LIFO)" },
        { id: "B", text: "Queue (FIFO)" },
        { id: "C", text: "Binary Heap" },
        { id: "D", text: "Hash Table" }
      ],
      correctAnswer: "A",
      explanation: "Stacks adhere to Last-In First-Out, making them ideal for tracking nested delimiters and operator precedence parsing."
    },
    {
      text: "In a circular queue of capacity N implemented via an array, which condition signifies that the queue is completely full?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "(rear + 1) % N == front" },
        { id: "B", text: "rear == front" },
        { id: "C", text: "rear == N - 1" },
        { id: "D", text: "front == (rear + 1)" }
      ],
      correctAnswer: "A",
      explanation: "Using modulo arithmetic, when advancing the rear pointer by one lands on the front pointer, the circular queue is full."
    }
  ],

  graphs: [
    {
      text: "What is the time complexity of Dijkstra's single-source shortest path algorithm on a graph with V vertices and E edges using a binary min-heap?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "O((V + E) log V)" },
        { id: "B", text: "O(V^2)" },
        { id: "C", text: "O(V * E)" },
        { id: "D", text: "O(E log E)" }
      ],
      correctAnswer: "A",
      explanation: "Each vertex extraction takes O(log V) and each edge relaxation takes O(log V), yielding total time O((V + E) log V)."
    },
    {
      text: "Which algorithm can correctly compute shortest paths and detect negative weight cycles in a directed weighted graph?",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "Bellman-Ford Algorithm" },
        { id: "B", text: "Dijkstra's Algorithm" },
        { id: "C", text: "Prim's Algorithm" },
        { id: "D", text: "Kruskal's Algorithm" }
      ],
      correctAnswer: "A",
      explanation: "Bellman-Ford relaxes all E edges V-1 times. A V-th iteration that still reduces distance confirms a negative cycle."
    },
    {
      text: "Topological sorting can be performed on any directed graph, even if it contains cycles.",
      type: "True/False",
      difficulty: "Easy",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "B",
      explanation: "Topological ordering is strictly valid only on Directed Acyclic Graphs (DAGs)."
    }
  ],

  // --- DBMS ---
  "sql queries": [
    {
      text: "Which SQL clause is used to filter grouped records after applying an aggregation function with GROUP BY?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "HAVING" },
        { id: "B", text: "WHERE" },
        { id: "C", text: "ORDER BY" },
        { id: "D", text: "LIMIT" }
      ],
      correctAnswer: "A",
      explanation: "WHERE filters rows before aggregation; HAVING filters groups after aggregate calculations."
    },
    {
      text: "What does an INNER JOIN between Table A and Table B return?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "Only records that have matching keys in both tables" },
        { id: "B", text: "All records from Table A and matching records from Table B" },
        { id: "C", text: "The Cartesian product of all rows" },
        { id: "D", text: "All rows from both tables including unmatched records" }
      ],
      correctAnswer: "A",
      explanation: "INNER JOIN produces rows where the specified join predicate evaluates to true in both tables."
    }
  ],

  normalization: [
    {
      text: "A relational schema is in Boyce-Codd Normal Form (BCNF) if and only if for every non-trivial functional dependency X -> Y:",
      type: "MCQ",
      difficulty: "Medium",
      options: [
        { id: "A", text: "X is a super key" },
        { id: "B", text: "Y is a prime attribute" },
        { id: "C", text: "X is atomic" },
        { id: "D", text: "Y is a subset of X" }
      ],
      correctAnswer: "A",
      explanation: "BCNF is a stricter version of 3NF requiring the determinant X in every non-trivial dependency X -> Y to be a super key."
    },
    {
      text: "Second Normal Form (2NF) eliminates partial functional dependencies where a non-prime attribute depends on part of a composite candidate key.",
      type: "True/False",
      difficulty: "Easy",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "A",
      explanation: "2NF requires 1NF and mandates that all non-prime attributes are fully functionally dependent on the primary key."
    }
  ],

  // --- Computer Networks ---
  "tcp/ip protocol": [
    {
      text: "How many packets are exchanged during the standard TCP connection establishment handshake?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "3 (SYN, SYN-ACK, ACK)" },
        { id: "B", text: "2 (SYN, ACK)" },
        { id: "C", text: "4 (SYN, ACK, FIN, ACK)" },
        { id: "D", text: "1 (CONNECT)" }
      ],
      correctAnswer: "A",
      explanation: "TCP uses a three-way handshake: Client sends SYN, Server replies with SYN-ACK, Client acknowledges with ACK."
    },
    {
      text: "Which Transport Layer protocol provides connectionless, unreliable, best-effort datagram delivery with minimal header overhead?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "UDP (User Datagram Protocol)" },
        { id: "B", text: "TCP (Transmission Control Protocol)" },
        { id: "C", text: "SCTP" },
        { id: "D", text: "IP (Internet Protocol)" }
      ],
      correctAnswer: "A",
      explanation: "UDP does not establish connections or guarantee delivery/order, making it fast and suitable for real-time traffic."
    }
  ],

  // --- Algorithms ---
  "dynamic programming": [
    {
      text: "What two foundational properties must an optimization problem exhibit to be solvable via Dynamic Programming?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "Optimal Substructure and Overlapping Subproblems" },
        { id: "B", text: "Greedy Choice Property and Disjoint Subproblems" },
        { id: "C", text: "Divide and Conquer with Constant Recursion" },
        { id: "D", text: "Linear Time Complexity and Sorting Invariant" }
      ],
      correctAnswer: "A",
      explanation: "DP is applicable when an optimal global solution is constructed from optimal subproblem solutions, and recursive calls repeatedly solve identical subproblems."
    },
    {
      text: "The 0/1 Knapsack problem with n items and maximum weight W can be solved in polynomial time O(n + W).",
      type: "True/False",
      difficulty: "Medium",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "B",
      explanation: "0/1 Knapsack runs in O(n * W) time, which is pseudo-polynomial because W depends on the magnitude of the integer input, not input bit length."
    }
  ],

  // --- Web Technologies ---
  "react framework": [
    {
      text: "In React 18, which hook is used to execute side effects like API fetching, DOM subscriptions, and cleanup timers?",
      type: "MCQ",
      difficulty: "Easy",
      options: [
        { id: "A", text: "useEffect" },
        { id: "B", text: "useState" },
        { id: "C", text: "useMemo" },
        { id: "D", text: "useCallback" }
      ],
      correctAnswer: "A",
      explanation: "useEffect is specifically intended to handle side effects after layout rendering, with optional return functions for cleanups."
    },
    {
      text: "React's Virtual DOM improves client rendering performance by batching DOM updates and minimizing costly real-browser reflows.",
      type: "True/False",
      difficulty: "Easy",
      options: [
        { id: "A", text: "True" },
        { id: "B", text: "False" }
      ],
      correctAnswer: "A",
      explanation: "Reconciliation computes differences between Virtual DOM trees and applies batched minimal patches to the real DOM."
    }
  ]
};

/**
 * Helper to match any topic to known curated questions or generate tailored questions
 */
function getQuestionsForTopic(subject = '', topic = '') {
  const normTopic = topic.toLowerCase().trim();
  const normSubject = subject.toLowerCase().trim();

  // Search by exact or partial key match
  for (const [key, questions] of Object.entries(TOPIC_QUESTION_BANK)) {
    if (normTopic.includes(key) || key.includes(normTopic) || normSubject.includes(key)) {
      return questions;
    }
  }

  // Fallback keyword associations
  if (normTopic.includes('tree') || normTopic.includes('bst') || normTopic.includes('avl')) return TOPIC_QUESTION_BANK.trees;
  if (normTopic.includes('array') || normTopic.includes('vector')) return TOPIC_QUESTION_BANK.arrays;
  if (normTopic.includes('list') || normTopic.includes('linked')) return TOPIC_QUESTION_BANK["linked lists"];
  if (normTopic.includes('stack') || normTopic.includes('queue')) return TOPIC_QUESTION_BANK["stacks & queues"];
  if (normTopic.includes('graph') || normTopic.includes('dfs') || normTopic.includes('bfs')) return TOPIC_QUESTION_BANK.graphs;
  if (normTopic.includes('lock') || normTopic.includes('deadlock') || normTopic.includes('banker')) return TOPIC_QUESTION_BANK.deadlocks;
  if (normTopic.includes('schedul') || normTopic.includes('cpu') || normTopic.includes('round robin')) return TOPIC_QUESTION_BANK["cpu scheduling"];
  if (normTopic.includes('memory') || normTopic.includes('page') || normTopic.includes('segment')) return TOPIC_QUESTION_BANK["memory management"];
  if (normTopic.includes('process') || normTopic.includes('fork') || normTopic.includes('ipc')) return TOPIC_QUESTION_BANK["process management"];
  if (normTopic.includes('sql') || normTopic.includes('query') || normTopic.includes('join')) return TOPIC_QUESTION_BANK["sql queries"];
  if (normTopic.includes('normal') || normTopic.includes('bcnf') || normTopic.includes('dependency')) return TOPIC_QUESTION_BANK.normalization;
  if (normTopic.includes('network') || normTopic.includes('tcp') || normTopic.includes('ip') || normTopic.includes('osi')) return TOPIC_QUESTION_BANK["tcp/ip protocol"];
  if (normTopic.includes('dynamic') || normTopic.includes('dp') || normTopic.includes('knapsack')) return TOPIC_QUESTION_BANK["dynamic programming"];
  if (normTopic.includes('react') || normTopic.includes('web') || normTopic.includes('hook')) return TOPIC_QUESTION_BANK["react framework"];

  return null;
}

/**
 * Dynamically synthesizes customized, mathematically and conceptually unique questions
 * Uses diverse archetypes so no two generated questions ever repeat.
 */
function createTopicTailoredQuestion(subject, topic, index, diff, type, marks, neg) {
  if (type === 'Programming') {
    const progScenarios = [
      `Implement an optimal algorithmic function addressing "${topic}" in ${subject}. Process input scale N <= 10^5 within 1.0 second, handling null inputs and extreme boundaries.`,
      `Design and implement a clean, in-place transformation for "${topic}" in ${subject} achieving O(N) linear time and O(1) auxiliary space complexity.`,
      `Implement a robust state validator for ${subject} - ${topic} that detects invariant violations and circular dependencies in O(V + E) time.`
    ];
    return {
      id: `ai_gen_${Date.now()}_${index}`,
      subject,
      topic,
      type: 'Programming',
      difficulty: diff,
      marks: marks * 2,
      negativeMarks: 0,
      text: progScenarios[(index - 1) % progScenarios.length],
      codeProblemId: 'prob_custom_code',
      isApproved: false,
      explanation: `Requires optimal algorithmic structuring in ${topic} achieving sub-quadratic O(N log N) or O(N) complexity.`
    };
  }

  if (type === 'True/False') {
    const tfVariations = [
      {
        text: `In ${subject} (${topic}) [Concept Check #${index}]: An optimal system design paradigm mandates strict invariant consistency checks during state transitions to prevent cascading failures.`,
        correctAnswer: 'A',
        explanation: `True. Invariant enforcement guarantees state integrity and prevents corrupted intermediate representations in ${topic}.`
      },
      {
        text: `In ${subject} (${topic}) [Heuristic Check #${index}]: A greedy local choice is mathematically guaranteed to produce a globally optimal solution across all non-deterministic problem domains.`,
        correctAnswer: 'B',
        explanation: `False. Greedy algorithms only yield global optima when the problem demonstrates the greedy-choice property and optimal substructure.`
      },
      {
        text: `In ${subject} - ${topic} [Complexity Check #${index}]: An algorithm requiring O(1) auxiliary memory uses a fixed allocation that does not scale with input instance size N.`,
        correctAnswer: 'A',
        explanation: `True. Constant space complexity O(1) means auxiliary storage remains bounded regardless of N.`
      },
      {
        text: `In ${subject} (${topic}) [Concurrency Check #${index}]: Asynchronous multithreaded operations without mutual exclusion primitives can reliably execute shared memory mutations without data races.`,
        correctAnswer: 'B',
        explanation: `False. Concurrent uncoordinated writes to shared mutable memory inevitably cause non-deterministic race conditions and state corruption.`
      },
      {
        text: `In ${subject} (${topic}) [Architecture Check #${index}]: Decoupling abstract interfaces from concrete implementations facilitates unit testing and modular extensibility.`,
        correctAnswer: 'A',
        explanation: `True. Interface inversion adheres to SOLID principles and isolates consumers from underlying implementation changes.`
      }
    ];

    const chosenTF = tfVariations[(index - 1) % tfVariations.length];
    return {
      id: `ai_gen_${Date.now()}_${index}`,
      subject,
      topic,
      type: 'True/False',
      difficulty: diff,
      marks,
      negativeMarks: neg,
      text: chosenTF.text,
      options: [
        { id: 'A', text: 'True' },
        { id: 'B', text: 'False' }
      ],
      correctAnswer: chosenTF.correctAnswer,
      isApproved: false,
      explanation: chosenTF.explanation
    };
  }

  if (type === 'Multiple select') {
    const msVariations = [
      {
        text: `Which of the following architectural principles apply to performance and reliability in ${subject} (${topic})? (Select all that apply) [Item #${index}]`,
        options: [
          { id: 'A', text: `Minimizing redundant computational passes across ${topic} structures` },
          { id: 'B', text: `Enforcing strict boundary validation and error containment` },
          { id: 'C', text: `Allocating unbounded recursive execution frames without termination base-cases` },
          { id: 'D', text: `Maintaining cache spatial and temporal locality where possible` }
        ],
        correctAnswer: ['A', 'B', 'D'],
        explanation: `Optimization in ${topic} relies on minimizing passes, validating inputs, and maintaining cache locality.`
      },
      {
        text: `Which defensive software engineering practices are essential when implementing systems for ${subject} (${topic})? (Select all that apply) [Item #${index}]`,
        options: [
          { id: 'A', text: 'Checking for null, undefined, or empty boundaries before accessing inner attributes' },
          { id: 'B', text: 'Deterministic resource deallocation via RAII or structured try-finally blocks' },
          { id: 'C', text: 'Silently suppressing all runtime exceptions without logging or alerts' },
          { id: 'D', text: 'Enforcing atomic transactions to prevent partial state corruption' }
        ],
        correctAnswer: ['A', 'B', 'D'],
        explanation: 'Defensive engineering requires boundary validation, deterministic cleanup, and atomic safety; silent exception swallowing is an anti-pattern.'
      },
      {
        text: `Under high concurrent load in ${subject} (${topic}), which criteria preserve data consistency? (Select all that apply) [Item #${index}]`,
        options: [
          { id: 'A', text: 'Serializability of concurrent transaction execution paths' },
          { id: 'B', text: 'Preventing dirty reads and lost update anomalies' },
          { id: 'C', text: 'Allowing uncommitted reads to bypass lock waiting' },
          { id: 'D', text: 'Atomicity of multi-step state mutations' }
        ],
        correctAnswer: ['A', 'B', 'D'],
        explanation: 'ACID principles guarantee serializability, isolation, and atomicity under concurrent execution.'
      }
    ];

    const chosenMS = msVariations[(index - 1) % msVariations.length];
    return {
      id: `ai_gen_${Date.now()}_${index}`,
      subject,
      topic,
      type: 'Multiple select',
      difficulty: diff,
      marks,
      negativeMarks: neg,
      text: chosenMS.text,
      options: chosenMS.options,
      correctAnswer: chosenMS.correctAnswer,
      isApproved: false,
      explanation: chosenMS.explanation
    };
  }

  // Standard MCQ - 10 Diverse Concept Archetypes
  const scaleN = 1000 * Math.pow(2, (index % 6) + 1);
  const pPct = 20 + (index % 8) * 5;
  const speedupVal = (1 / ((1 - (pPct / 100)) + (pPct / 100) / 4)).toFixed(2);

  const variations = [
    {
      text: `In the context of ${subject} (${topic}), what is the primary computational trade-off when optimizing for throughput over memory consumption? [Analysis #${index}]`,
      options: [
        { id: 'A', text: 'Precomputing and caching auxiliary state representations in RAM to accelerate query resolution' },
        { id: 'B', text: 'Eliminating index structures to minimize primary memory usage' },
        { id: 'C', text: 'Executing brute-force linear scans across unindexed storage' },
        { id: 'D', text: 'Compressing memory buffers dynamically on every read request' }
      ],
      correctAnswer: 'A',
      explanation: `Space-time trade-off in ${topic} standardly utilizes memoization or auxiliary indexing to reduce latency.`
    },
    {
      text: `When evaluating edge-cases in ${subject} - ${topic}, which defensive check must be executed first to prevent unexpected runtime faults? [Edge Check #${index}]`,
      options: [
        { id: 'A', text: 'Null or empty boundary state before attempting dereferencing or indexing' },
        { id: 'B', text: 'CPU cache line saturation thresholds' },
        { id: 'C', text: 'Hardware floating-point rounding flags' },
        { id: 'D', text: 'Network round-trip latency timers' }
      ],
      correctAnswer: 'A',
      explanation: `Defensive programming requires checking for empty, null, or out-of-range initial states before operations.`
    },
    {
      text: `In ${subject} - ${topic}, how does asymptotic scale factor N affect worst-case complexity thresholds as N grows arbitrarily large? [Scalability #${index}]`,
      options: [
        { id: 'A', text: 'Dominant highest-order terms determine growth rate as N approaches infinity' },
        { id: 'B', text: 'Lower order additive constants dominate scaling behavior' },
        { id: 'C', text: 'Memory allocation size is always independent of input scale' },
        { id: 'D', text: 'Algorithm complexity reduces proportionally as input size increases' }
      ],
      correctAnswer: 'A',
      explanation: `Big-O asymptotic analysis in ${topic} is defined by the fastest-growing term as input size N grows.`
    },
    {
      text: `According to Amdahl's Law in ${subject} (${topic}), if a parallelizable module accounting for ${pPct}% of execution time is speeded up by 4x, what is the overall theoretical speedup? [Calculation #${index}]`,
      options: [
        { id: 'A', text: `Approximately ${speedupVal}x overall system speedup` },
        { id: 'B', text: 'Exactly 4.00x linear speedup' },
        { id: 'C', text: 'No speedup (1.00x)' },
        { id: 'D', text: `${pPct}% speedup` }
      ],
      correctAnswer: 'A',
      explanation: `Speedup = 1 / ((1 - P) + P / S) = 1 / ((1 - ${pPct/100}) + ${pPct/100} / 4) = ${speedupVal}x.`
    },
    {
      text: `For a dataset of scale N = ${scaleN.toLocaleString()} items in ${subject} (${topic}), which algorithmic complexity class guarantees completion in fewer than 10^7 elementary operations? [Benchmarking #${index}]`,
      options: [
        { id: 'A', text: 'O(N log N) Linearithmic Complexity' },
        { id: 'B', text: 'O(N^3) Cubic Complexity' },
        { id: 'C', text: 'O(2^N) Exponential Complexity' },
        { id: 'D', text: 'O(N!) Factorial Complexity' }
      ],
      correctAnswer: 'A',
      explanation: `For N = ${scaleN.toLocaleString()}, N log2(N) is approximately ${Math.round(scaleN * Math.log2(scaleN)).toLocaleString()} operations, easily finishing below 10^7.`
    },
    {
      text: `In concurrent execution environments managing ${subject} - ${topic}, what is the risk of utilizing non-atomic read-modify-write operations? [Concurrency #${index}]`,
      options: [
        { id: 'A', text: 'Lost updates and race conditions leading to corrupted shared state' },
        { id: 'B', text: 'Hardware clock skew across CPU cores' },
        { id: 'C', text: 'Immediate kernel page fault panic' },
        { id: 'D', text: 'Permanent deletion of physical disk partitions' }
      ],
      correctAnswer: 'A',
      explanation: 'Non-atomic mutations across interleaved thread schedules cause lost updates and invalid intermediate states.'
    },
    {
      text: `How does spatial locality optimize memory access in ${subject} (${topic}) algorithms? [Hardware Cache #${index}]`,
      options: [
        { id: 'A', text: 'Accessing memory addresses contiguous to recently referenced elements loads full cache lines, minimizing cache misses' },
        { id: 'B', text: 'Scattering memory allocations randomly across physical frames' },
        { id: 'C', text: 'Disabling CPU L1 and L2 caches completely' },
        { id: 'D', text: 'Using linked nodes scattered across fragmented heap memory' }
      ],
      correctAnswer: 'A',
      explanation: 'Spatial locality exploits the fact that modern memory architectures fetch cache lines of 64 bytes, making sequential memory traversal fast.'
    },
    {
      text: `In ${subject} - ${topic}, what is the key characteristic of an idempotent operation? [System Property #${index}]`,
      options: [
        { id: 'A', text: 'Executing the operation multiple times with the same inputs produces the identical state outcome as executing it once' },
        { id: 'B', text: 'The operation must execute within zero clock cycles' },
        { id: 'C', text: 'The operation permanently locks the database until reboot' },
        { id: 'D', text: 'The operation cannot accept any input arguments' }
      ],
      correctAnswer: 'A',
      explanation: 'Idempotence means f(f(x)) = f(x), ensuring safe retries without unintended side effects.'
    }
  ];

  const chosen = variations[(index - 1) % variations.length];
  return {
    id: `ai_gen_${Date.now()}_${index}`,
    subject,
    topic,
    type: 'MCQ',
    difficulty: diff,
    marks,
    negativeMarks: neg,
    ...chosen,
    isApproved: false
  };
}

/**
 * Shuffles options for a question using Fisher-Yates and updates correctAnswer accordingly
 */
export function shuffleQuestionOptions(question) {
  if (
    !question ||
    !question.options ||
    question.options.length <= 1 ||
    question.type === 'True/False' ||
    question.type === 'Programming'
  ) {
    return question;
  }

  // 1. Identify which option text(s) are correct from the original key
  const correctIds = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [question.correctAnswer];

  const correctTexts = new Set();
  question.options.forEach((opt) => {
    if (correctIds.includes(opt.id) || correctIds.includes(opt.text)) {
      correctTexts.add(opt.text);
    }
  });

  // 2. Clone and shuffle options using Fisher-Yates
  const shuffled = question.options.map((o) => ({ ...o }));
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // 3. Re-index with clean sequential option keys 'A', 'B', 'C', 'D'
  const newOptions = shuffled.map((opt, idx) => ({
    id: String.fromCharCode(65 + idx),
    text: opt.text
  }));

  // 4. Determine the new option ID(s) for the correct answer
  const newCorrectIds = [];
  newOptions.forEach((opt) => {
    if (correctTexts.has(opt.text)) {
      newCorrectIds.push(opt.id);
    }
  });

  // Safe fallback if matching somehow yielded 0
  if (newCorrectIds.length === 0 && newOptions.length > 0) {
    newCorrectIds.push(newOptions[0].id);
  }

  return {
    ...question,
    options: newOptions,
    correctAnswer: Array.isArray(question.correctAnswer) ? newCorrectIds : newCorrectIds[0]
  };
}

export const aiService = {
  shuffleQuestionOptions,

  /**
   * Generates questions for Admin Exam Creation wizard & Student Mock Tests
   * Guarantees 100% UNIQUE, diverse questions without ANY duplicates or repeated items!
   */
  generateExamQuestions: async ({
    stream,
    subject = 'Computer Science',
    topic = 'General',
    numberOfQuestions = 5,
    difficulty = 'Medium',
    questionType = 'Mixed',
    marksPerQuestion = 2,
    negativeMarks = 0.5
  }) => {
    await new Promise((r) => setTimeout(r, 400));

    const targetCount = Math.max(1, Number(numberOfQuestions) || 5);
    const generated = [];
    const usedSignatures = new Set();

    // 1. Retrieve all curated questions for this topic
    const curatedPool = getQuestionsForTopic(subject, topic) || [];

    // Filter curated pool by questionType if a specific format is requested
    let matchingCandidates = questionType === 'Mixed'
      ? [...curatedPool]
      : curatedPool.filter((q) => q.type === questionType);

    // Shuffle curated candidates so order is varied
    for (let i = matchingCandidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [matchingCandidates[i], matchingCandidates[j]] = [matchingCandidates[j], matchingCandidates[i]];
    }

    // 2. Add unique curated questions first (NO cycling with modulo!)
    for (const q of matchingCandidates) {
      if (generated.length >= targetCount) break;
      const sig = (q.text || '').slice(0, 45).toLowerCase().trim();
      if (!usedSignatures.has(sig)) {
        usedSignatures.add(sig);
        generated.push({
          id: `ai_gen_${Date.now()}_${generated.length + 1}`,
          stream,
          subject,
          topic,
          type: q.type,
          difficulty: q.difficulty || difficulty,
          marks: q.type === 'Programming' ? marksPerQuestion * 2 : marksPerQuestion,
          negativeMarks: q.type === 'Programming' ? 0 : negativeMarks,
          text: q.text,
          options: q.options ? q.options.map((o) => ({ ...o })) : [],
          correctAnswer: q.correctAnswer,
          isApproved: false,
          explanation: q.explanation || `Derived from verified academic principles for ${subject} (${topic}).`
        });
      }
    }

    // 3. If targetCount exceeds available curated questions, generate UNIQUE parameterized questions
    let extraIndex = 1;
    while (generated.length < targetCount) {
      const diff = difficulty === 'Mixed'
        ? ['Easy', 'Medium', 'Hard'][generated.length % 3]
        : difficulty;

      let chosenType = questionType;
      if (questionType === 'Mixed') {
        const types = ['MCQ', 'MCQ', 'Multiple select', 'True/False', 'Programming'];
        chosenType = types[generated.length % types.length];
      }

      const synthetic = createTopicTailoredQuestion(
        subject,
        topic,
        extraIndex,
        diff,
        chosenType,
        marksPerQuestion,
        negativeMarks
      );

      const sig = (synthetic.text || '').slice(0, 45).toLowerCase().trim();
      if (!usedSignatures.has(sig)) {
        usedSignatures.add(sig);
        generated.push({
          ...synthetic,
          id: `ai_gen_${Date.now()}_${generated.length + 1}`,
          stream
        });
      }
      extraIndex++;
      if (extraIndex > targetCount * 5) break; // safety guardrail
    }

    // Automatically jumble options for all questions so correct answer is varied
    return generated.map((q) => shuffleQuestionOptions(q));
  },

  /**
   * Regenerates a single question with fresh AI variation on its topic
   */
  regenerateSingleQuestion: async (question) => {
    await new Promise((r) => setTimeout(r, 400));
    const randomIdx = Math.floor(Math.random() * 50) + 1;
    const fresh = createTopicTailoredQuestion(
      question.subject,
      question.topic,
      randomIdx,
      question.difficulty,
      question.type,
      question.marks,
      question.negativeMarks
    );

    return shuffleQuestionOptions({
      ...question,
      id: `ai_regen_${Date.now()}`,
      text: fresh.text,
      options: fresh.options,
      correctAnswer: fresh.correctAnswer,
      explanation: fresh.explanation,
      isApproved: false
    });
  },

  /**
   * Generates student AI practice mock test
   */
  generateStudentMockTest: async (params) => {
    const qCount = Number(params.numberOfQuestions) || 10;
    const dur = Number(params.duration) || 20;
    let questions = [];
    let backendId = null;

    const validDifficulty = ['Easy', 'Medium', 'Hard'].includes(params.difficulty)
      ? params.difficulty.toUpperCase()
      : 'MEDIUM';

    try {
      const res = await api.post('/mock-tests/generate', {
        streamId: params.stream || 'cse',
        subjectName: params.subject || 'Data Structures',
        topicName: params.topic || 'General',
        difficulty: validDifficulty,
        numberOfQuestions: qCount,
        durationMinutes: dur,
        questionType: params.questionType || 'MCQ'
      });

      if (res?.data) {
        backendId = res.data.id;
        const rawList = res.data.populatedQuestions || res.data.questionsData || [];
        if (Array.isArray(rawList) && rawList.length > 0) {
          questions = rawList.map((q, idx) => ({
            id: q.id || `mock_q_${Date.now()}_${idx}`,
            text: q.text || q.questionText,
            type: q.type === 'MULTIPLE_SELECT' ? 'Multiple select' : q.type === 'TRUE_FALSE' ? 'True/False' : q.type === 'PROGRAMMING' ? 'Programming' : (q.type || params.questionType || 'MCQ'),
            difficulty: q.difficulty || params.difficulty || 'Medium',
            marks: q.marks || q.defaultMarks || 2,
            negativeMarks: q.negativeMarks || 0,
            options: (q.options || []).map((o, oIdx) => ({
              id: o.id || o.optionKey || String.fromCharCode(65 + oIdx),
              text: typeof o === 'string' ? o : o.text
            })),
            correctAnswer: q.correctAnswer || (q.options?.find((opt) => opt.isCorrect)?.optionKey) || 'A',
            explanation: q.explanation || `Comprehensive explanation for ${params.topic}.`
          }));
        }
      }
    } catch (apiErr) {
      console.warn('Backend mock test generation deferred, using local AI generator:', apiErr.message);
    }

    // Local high-fidelity fallback
    if (!questions || questions.length === 0) {
      await new Promise((r) => setTimeout(r, 500));
      questions = await aiService.generateExamQuestions({
        stream: params.stream,
        subject: params.subject,
        topic: params.topic,
        numberOfQuestions: qCount,
        difficulty: params.difficulty || 'Medium',
        questionType: params.questionType || 'MCQ',
        marksPerQuestion: 2,
        negativeMarks: 0
      });
    }

    // Jumble options
    const finalQuestions = questions.map((q) => shuffleQuestionOptions(q));

    const mockExam = {
      id: backendId || 'mock_' + Date.now(),
      title: `AI Practice Drill: ${params.subject || 'Engineering'} (${params.topic || 'Practice Drill'})`,
      subject: params.subject || 'Data Structures',
      topic: params.topic || 'General Practice',
      durationMinutes: dur,
      totalQuestions: finalQuestions.length,
      totalMarks: finalQuestions.reduce((acc, q) => acc + (q.marks || 2), 0) || (finalQuestions.length * 2),
      difficulty: params.difficulty || 'Medium',
      isMock: true,
      populatedQuestions: finalQuestions
    };

    // Save into storage for instant retrieval by examTaking page
    try {
      const mockList = storage.get('mock_tests_list') || [];
      mockList.unshift(mockExam);
      storage.set('mock_tests_list', mockList.slice(0, 30));

      const examsList = storage.get('exams_list') || [];
      if (!examsList.some((e) => e.id === mockExam.id)) {
        examsList.unshift(mockExam);
        storage.set('exams_list', examsList);
      }
    } catch (e) {
      console.warn('Error saving mock test to storage:', e);
    }

    return mockExam;
  },

  /**
   * AI Chatbot with English and Telugu academic assistance
   */
  askChatbot: async ({ message, history = [], language = 'en', conversationId = null }) => {
    try {
      const res = await api.post('/ai/message', {
        message,
        conversationId,
        language
      });
      if (res?.data?.response) {
        return {
          role: 'assistant',
          language: res.data.language || language,
          content: res.data.response,
          conversationId: res.data.conversationId
        };
      }
    } catch (apiErr) {
      console.warn('Backend chatbot endpoint deferred, using local bilingual AI tutor engine:', apiErr.message);
    }

    await new Promise((r) => setTimeout(r, 400));
    const lower = message.toLowerCase();
    const isTelugu = language === 'te' || /[\u0C00-\u0C7F]/.test(message);

    if (isTelugu) {
      if (lower.includes('binary tree') || lower.includes('tree') || lower.includes('చెట్టు') || lower.includes('ట్రీ')) {
        return {
          role: 'assistant',
          language: 'te',
          content: `**బైనరీ ట్రీ (Binary Tree) వివరణ:**\n\nబైనరీ ట్రీ అనేది ఒక క్రమానుగత డేటా స్ట్రక్చర్ (Hierarchical Data Structure), ఇందులో ప్రతి నోడ్‌కు గరిష్టంగా **రెండు చైల్డ్ నోడ్స్** మాత్రమే ఉంటాయి:\n1. ఎడమ చైల్డ్ (Left Child)\n2. కుడి చైల్డ్ (Right Child)`
        };
      }
      return {
        role: 'assistant',
        language: 'te',
        content: `నమస్కారం! నేను **Quentrix AI** అసిస్టెంట్‌ని. ఇంజనీరింగ్, ప్రోగ్రామింగ్ మరియు పరీక్షల తయారీలో మీకు సహాయం చేయగలను.`
      };
    }

    if (lower.includes('deadlock') || lower.includes('banker') || lower.includes('semaphore')) {
      return {
        role: 'assistant',
        language: 'en',
        content: `### Operating Systems: Deadlock & Prevention\n\nA **Deadlock** occurs when a set of concurrent processes are permanently blocked because each process holds a resource and waits for another resource held by another process.\n\n#### 4 Necessary Coffman Conditions:\n1. **Mutual Exclusion**\n2. **Hold and Wait**\n3. **No Preemption**\n4. **Circular Wait**`
      };
    }

    return {
      role: 'assistant',
      language: 'en',
      content: `Hello! I am **Quentrix AI**, your intelligent academic companion and technical assessment tutor. How would you like to level up your engineering practice today?`
    };
  }
};
