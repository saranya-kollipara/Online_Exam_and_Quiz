// Quentrix AI - Comprehensive Mock Data Store

export const STREAMS = [
  { id: 'cse', name: 'Computer Science & Engineering', code: 'CSE' },
  { id: 'it', name: 'Information Technology', code: 'IT' },
  { id: 'ece', name: 'Electronics & Communication', code: 'ECE' },
  { id: 'eee', name: 'Electrical & Electronics', code: 'EEE' },
  { id: 'mech', name: 'Mechanical Engineering', code: 'MECH' },
];

export const SUBJECTS_BY_STREAM = {
  cse: [
    { id: 'ds', name: 'Data Structures', topics: ['Arrays', 'Linked Lists', 'Stacks & Queues', 'Trees', 'Graphs', 'Hashing'] },
    { id: 'algo', name: 'Design & Analysis of Algorithms', topics: ['Asymptotic Analysis', 'Divide and Conquer', 'Greedy Algorithms', 'Dynamic Programming', 'Graph Algorithms'] },
    { id: 'os', name: 'Operating Systems', topics: ['Process Management', 'CPU Scheduling', 'Deadlocks', 'Memory Management', 'File Systems'] },
    { id: 'dbms', name: 'Database Management Systems', topics: ['ER Modeling', 'Relational Algebra', 'SQL Queries', 'Normalization', 'Transaction & Concurrency'] },
    { id: 'cn', name: 'Computer Networks', topics: ['OSI Model', 'TCP/IP Protocol', 'Routing Algorithms', 'Transport Layer', 'Network Security'] },
    { id: 'ai', name: 'Artificial Intelligence & ML', topics: ['Search Algorithms', 'Knowledge Representation', 'Supervised Learning', 'Neural Networks', 'NLP Basics'] }
  ],
  it: [
    { id: 'web', name: 'Web Technologies', topics: ['HTML5/CSS3', 'JavaScript ES6+', 'React Framework', 'RESTful APIs', 'Web Security'] },
    { id: 'cloud', name: 'Cloud Computing & DevOps', topics: ['Virtualization', 'AWS Services', 'Docker Containers', 'CI/CD Pipelines', 'Serverless'] },
    { id: 'sec', name: 'Cyber Security & Cryptography', topics: ['Symmetric Encryption', 'Public Key Infrastructure', 'Firewalls', 'Ethical Hacking'] }
  ],
  ece: [
    { id: 'dsp', name: 'Digital Signal Processing', topics: ['DFT & FFT', 'IIR Filters', 'FIR Filters', 'Multirate DSP'] },
    { id: 'vlsi', name: 'VLSI Design', topics: ['CMOS Inverters', 'Combinational Logic', 'Sequential Circuits', 'FPGA Architecture'] },
    { id: 'micro', name: 'Microprocessors & Microcontrollers', topics: ['8086 Architecture', 'ARM Cortex', 'Interrupts', 'Interfacing'] }
  ],
  eee: [
    { id: 'control', name: 'Control Systems', topics: ['Transfer Functions', 'Time Response', 'Root Locus', 'Bode Plots', 'State Space'] },
    { id: 'power', name: 'Power Systems', topics: ['Transmission Lines', 'Fault Analysis', 'Load Flow', 'Protection Relays'] }
  ],
  mech: [
    { id: 'thermo', name: 'Thermodynamics', topics: ['First & Second Laws', 'Entropy', 'Gas Power Cycles', 'Refrigeration'] },
    { id: 'som', name: 'Strength of Materials', topics: ['Stress & Strain', 'Shear Force & Bending Moment', 'Torsion', 'Deflection of Beams'] }
  ]
};

export const MOCK_USERS = [
  {
    id: 'user_admin_01',
    name: 'Dr. Aris Thorne',
    email: 'admin@quentrix.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    title: 'Head of Examination & Academic Assessment',
    institution: 'National Institute of Technology & AI',
    department: 'School of Computing'
  },
  {
    id: 'user_student_01',
    name: 'Aditya Vardhan',
    email: 'student@quentrix.ai',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
    institution: 'Indian Institute of Engineering & Technology',
    stream: 'Computer Science & Engineering',
    streamId: 'cse',
    yearOfStudy: '3rd Year (Semester 6)',
    rollNo: '22CS8042',
    rank: 4,
    totalPoints: 2840,
    averageScore: 84.5,
    examsCompleted: 14,
    badge: 'Code Grandmaster'
  }
];

export const MOCK_QUESTIONS = [
  {
    id: 'q_ds_001',
    stream: 'cse',
    subject: 'Data Structures',
    topic: 'Trees',
    type: 'MCQ',
    difficulty: 'Medium',
    marks: 2,
    negativeMarks: 0.5,
    text: 'What is the maximum number of nodes in a binary tree of height h (where height of a tree with single root node is 0)?',
    options: [
      { id: 'A', text: '2^(h) - 1' },
      { id: 'B', text: '2^(h+1) - 1' },
      { id: 'C', text: '2^(h-1) + 1' },
      { id: 'D', text: '2^(2h) - 1' }
    ],
    correctAnswer: 'B',
    explanation: 'A binary tree has 2^0 nodes at level 0, 2^1 at level 1, up to 2^h at level h. Summing 2^0 + 2^1 + ... + 2^h gives 2^(h+1) - 1 nodes.',
    timesUsed: 12
  },
  {
    id: 'q_ds_002',
    stream: 'cse',
    subject: 'Data Structures',
    topic: 'Trees',
    type: 'MCQ',
    difficulty: 'Hard',
    marks: 3,
    negativeMarks: 1,
    text: 'In an AVL Tree, what is the maximum permissible difference between the heights of the left and right subtrees for any node?',
    options: [
      { id: 'A', text: '0' },
      { id: 'B', text: '1' },
      { id: 'C', text: '2' },
      { id: 'D', text: 'Any positive integer' }
    ],
    correctAnswer: 'B',
    explanation: 'The balance factor of any node in an AVL tree is defined as height(left) - height(right) and must be in the set {-1, 0, 1}. Thus the absolute difference is at most 1.',
    timesUsed: 18
  },
  {
    id: 'q_ds_003',
    stream: 'cse',
    subject: 'Data Structures',
    topic: 'Trees',
    type: 'Multiple select',
    difficulty: 'Medium',
    marks: 4,
    negativeMarks: 1,
    text: 'Which of the following self-balancing binary search trees guarantee worst-case O(log n) time complexity for search, insert, and delete operations? (Select all that apply)',
    options: [
      { id: 'A', text: 'Red-Black Tree' },
      { id: 'B', text: 'AVL Tree' },
      { id: 'C', text: 'Standard Unbalanced BST' },
      { id: 'D', text: 'Splay Tree' }
    ],
    correctAnswer: ['A', 'B'],
    explanation: 'Both Red-Black and AVL trees guarantee strict O(log n) worst-case time for search, insertion, and deletion. Standard BST degrades to O(n) for skewed trees, and Splay Tree guarantees amortized O(log n), not worst-case.',
    timesUsed: 15
  },
  {
    id: 'q_ds_004',
    stream: 'cse',
    subject: 'Data Structures',
    topic: 'Trees',
    type: 'True/False',
    difficulty: 'Easy',
    marks: 1,
    negativeMarks: 0.25,
    text: 'Inorder traversal of any valid Binary Search Tree (BST) produces keys in strictly ascending order.',
    options: [
      { id: 'A', text: 'True' },
      { id: 'B', text: 'False' }
    ],
    correctAnswer: 'A',
    explanation: 'In a BST, all keys in the left subtree are smaller than the node, and all keys in the right subtree are greater. Hence Inorder traversal (Left, Root, Right) yields sorted order.',
    timesUsed: 24
  },
  {
    id: 'q_ds_005',
    stream: 'cse',
    subject: 'Data Structures',
    topic: 'Arrays',
    type: 'MCQ',
    difficulty: 'Easy',
    marks: 2,
    negativeMarks: 0.5,
    text: 'What is the time complexity to access an element at index k in a contiguous array of size N?',
    options: [
      { id: 'A', text: 'O(1)' },
      { id: 'B', text: 'O(log N)' },
      { id: 'C', text: 'O(k)' },
      { id: 'D', text: 'O(N)' }
    ],
    correctAnswer: 'A',
    explanation: 'Arrays offer constant-time random access via direct memory offset calculation: Address = Base_Address + k * sizeof(element).',
    timesUsed: 30
  },
  {
    id: 'q_ds_006',
    stream: 'cse',
    subject: 'Data Structures',
    topic: 'Linked Lists',
    type: 'MCQ',
    difficulty: 'Medium',
    marks: 2,
    negativeMarks: 0.5,
    text: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) detects a loop in a linked list using two pointers moving at speeds of 1 and 2 nodes per step. What is its auxiliary space complexity?",
    options: [
      { id: 'A', text: 'O(N)' },
      { id: 'B', text: 'O(log N)' },
      { id: 'C', text: 'O(1)' },
      { id: 'D', text: 'O(N^2)' }
    ],
    correctAnswer: 'C',
    explanation: "Floyd's cycle detection only tracks two pointers, requiring O(1) constant auxiliary memory without requiring a hash set.",
    timesUsed: 22
  },
  {
    id: 'q_prog_001',
    stream: 'cse',
    subject: 'Data Structures',
    topic: 'Trees',
    type: 'Programming',
    difficulty: 'Medium',
    marks: 10,
    negativeMarks: 0,
    text: 'Write an algorithm to compute the maximum depth (height) of a binary tree given the root node.',
    codeProblemId: 'prob_tree_height',
    timesUsed: 9
  }
];

export const MOCK_EXAMS = [
  {
    id: 'exam_cs_301',
    title: 'Data Structures & Algorithms Comprehensive Mid-Term',
    stream: 'Computer Science & Engineering',
    streamId: 'cse',
    subject: 'Data Structures',
    topic: 'Trees, Linked Lists & Graphs',
    durationMinutes: 45,
    totalQuestions: 25,
    totalMarks: 50,
    negativeMarking: true,
    negativeMarks: 0.5,
    difficulty: 'Medium',
    questionType: 'Mixed',
    status: 'active', // 'active', 'upcoming', 'completed', 'draft'
    startDate: '2026-11-05T09:00:00Z',
    endDate: '2026-11-15T23:59:59Z',
    maxAttempts: 1,
    attemptsAllowed: 1,
    attemptsMade: 0,
    totalEnrolled: 184,
    participated: 142,
    averageScore: 36.8,
    highestScore: 48.0,
    description: 'Formal academic midterm covering non-linear data structures, binary search trees, heap structures, and graph traversals (BFS/DFS).',
    questions: [
      'q_ds_001', 'q_ds_002', 'q_ds_003', 'q_ds_004', 'q_ds_005', 'q_ds_006', 'q_prog_001'
    ]
  },
  {
    id: 'exam_cs_302',
    title: 'Operating Systems Concurrency & Deadlocks Assessment',
    stream: 'Computer Science & Engineering',
    streamId: 'cse',
    subject: 'Operating Systems',
    topic: 'Deadlocks & Process Synchronization',
    durationMinutes: 60,
    totalQuestions: 30,
    totalMarks: 60,
    negativeMarking: true,
    negativeMarks: 0.5,
    difficulty: 'Hard',
    questionType: 'MCQ',
    status: 'upcoming',
    startDate: '2026-11-12T10:00:00Z',
    endDate: '2026-11-14T20:00:00Z',
    maxAttempts: 1,
    attemptsAllowed: 1,
    attemptsMade: 0,
    totalEnrolled: 210,
    participated: 0,
    averageScore: 0,
    highestScore: 0,
    description: "Evaluates mastery over Banker's Algorithm, semaphores, mutex locks, condition variables, and virtual memory paging.",
    questions: ['q_ds_001', 'q_ds_005', 'q_ds_006']
  },
  {
    id: 'exam_cs_303',
    title: 'Database Systems & SQL Optimization Final Quiz',
    stream: 'Computer Science & Engineering',
    streamId: 'cse',
    subject: 'Database Management Systems',
    topic: 'Normalization & Transactions',
    durationMinutes: 40,
    totalQuestions: 20,
    totalMarks: 40,
    negativeMarking: false,
    negativeMarks: 0,
    difficulty: 'Easy',
    questionType: 'MCQ',
    status: 'completed',
    startDate: '2026-10-20T10:00:00Z',
    endDate: '2026-10-22T20:00:00Z',
    maxAttempts: 2,
    attemptsAllowed: 2,
    attemptsMade: 1,
    totalEnrolled: 195,
    participated: 188,
    averageScore: 33.4,
    highestScore: 40.0,
    description: 'Core evaluation on 1NF through BCNF normalization, ACID properties, serializability, and B+ tree indexing.',
    questions: ['q_ds_004', 'q_ds_005', 'q_ds_006'],
    studentResult: {
      score: 36,
      totalMarks: 40,
      percentage: 90.0,
      correct: 18,
      incorrect: 2,
      unanswered: 0,
      timeTakenMinutes: 28,
      completedAt: '2026-10-21T14:32:00Z',
      rank: 5
    }
  },
  {
    id: 'exam_cs_304',
    title: 'Full-Stack Web Development & Modern JS Sprint',
    stream: 'Information Technology',
    streamId: 'it',
    subject: 'Web Technologies',
    topic: 'React, ES6+ & REST APIs',
    durationMinutes: 50,
    totalQuestions: 20,
    totalMarks: 40,
    negativeMarking: true,
    negativeMarks: 0.25,
    difficulty: 'Medium',
    questionType: 'Mixed',
    status: 'active',
    startDate: '2026-11-01T08:00:00Z',
    endDate: '2026-11-20T22:00:00Z',
    maxAttempts: 1,
    attemptsAllowed: 1,
    attemptsMade: 0,
    totalEnrolled: 160,
    participated: 110,
    averageScore: 29.5,
    highestScore: 39.0,
    description: 'Practical test of asynchronous JavaScript, DOM manipulation, React hooks lifecycle, and secure API design.',
    questions: ['q_ds_001', 'q_ds_003', 'q_ds_004']
  }
];

export const MOCK_CODING_PROBLEMS = [
  {
    id: 'prob_tree_height',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    subject: 'Data Structures',
    topic: 'Trees',
    tags: ['Tree', 'DFS', 'Recursion'],
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `Given the root of a binary tree, return its maximum depth.
A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.`,
    inputFormat: 'Serialized level-order traversal of nodes, or pointer to root.',
    outputFormat: 'Integer representing the maximum depth.',
    constraints: [
      'The number of nodes in the tree is in the range [0, 10^4].',
      '-100 <= Node.val <= 100'
    ],
    sampleCases: [
      {
        input: 'root = [3,9,20,null,null,15,7]',
        output: '3',
        explanation: 'The deepest path is 3 -> 20 -> 15 (or 7), which has 3 nodes.'
      },
      {
        input: 'root = [1,null,2]',
        output: '2',
        explanation: 'The path is 1 -> 2, which has 2 nodes.'
      }
    ],
    starterCode: {
      python: `def maxDepth(root):\n    # Write your solution here\n    if not root:\n        return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n`,
      javascript: `function maxDepth(root) {\n  // Write your code here\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n`,
      java: `class Solution {\n    public int maxDepth(TreeNode root) {\n        // Write your solution here\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}`,
      cpp: `int maxDepth(TreeNode* root) {\n    // Write your solution here\n    if (!root) return 0;\n    return 1 + std::max(maxDepth(root->left), maxDepth(root->right));\n}`,
      c: `int maxDepth(struct TreeNode* root) {\n    // Write your solution here\n    if (root == NULL) return 0;\n    int left = maxDepth(root->left);\n    int right = maxDepth(root->right);\n    return 1 + (left > right ? left : right);\n}`
    },
    testCases: [
      { id: 1, name: 'Sample Case 1', input: '[3,9,20,null,null,15,7]', expectedOutput: '3', isHidden: false },
      { id: 2, name: 'Single Node Tree', input: '[1]', expectedOutput: '1', isHidden: false },
      { id: 3, name: 'Empty Tree', input: '[]', expectedOutput: '0', isHidden: true },
      { id: 4, name: 'Right Skewed Tree', input: '[1,null,2,null,3,null,4]', expectedOutput: '4', isHidden: true }
    ]
  },
  {
    id: 'prob_two_sum',
    title: 'Two Sum Target Search',
    difficulty: 'Easy',
    subject: 'Algorithms',
    topic: 'Arrays & Hashing',
    tags: ['Array', 'Hash Table'],
    timeLimit: '1.0s',
    memoryLimit: '256 MB',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
You may assume that each input would have exactly one solution, and you may not use the same element twice.`,
    inputFormat: 'First line contains integer N and target. Second line contains N integers.',
    outputFormat: 'Two space-separated integers representing the 0-indexed positions.',
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9'
    ],
    sampleCases: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    starterCode: {
      python: `def twoSum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []\n`,
      javascript: `function twoSum(nums, target) {\n  // Write your code here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}\n`,
      java: `import java.util.*;\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\nstd::vector<int> twoSum(std::vector<int>& nums, int target) {\n    std::unordered_map<int, int> map;\n    for (int i = 0; i < nums.size(); ++i) {\n        int comp = target - nums[i];\n        if (map.count(comp)) return {map[comp], i};\n        map[nums[i]] = i;\n    }\n    return {};\n}`,
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    // O(N^2) or hash implementation\n    *returnSize = 2;\n    int* res = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                res[0] = i; res[1] = j;\n                return res;\n            }\n        }\n    }\n    return res;\n}`
    },
    testCases: [
      { id: 1, name: 'Sample Case 1', input: '[2,7,11,15], target = 9', expectedOutput: '[0, 1]', isHidden: false },
      { id: 2, name: 'Negative Numbers', input: '[-3,4,3,90], target = 0', expectedOutput: '[0, 2]', isHidden: false },
      { id: 3, name: 'Identical Elements', input: '[3,3], target = 6', expectedOutput: '[0, 1]', isHidden: true },
      { id: 4, name: 'Large Values', input: '[1000000000, -1000000000], target = 0', expectedOutput: '[0, 1]', isHidden: true }
    ]
  },
  {
    id: 'prob_web_card',
    title: 'Interactive User Metric Card (Frontend Practice)',
    difficulty: 'Medium',
    subject: 'Web Technologies',
    topic: 'Frontend Development',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Live Preview'],
    isWebProblem: true,
    description: `Build an interactive metric card with responsive styling.
Requirements:
1. Card must display a title, animated counter value, and progress bar.
2. Clicking a button '+ Increment' smoothly increases counter.
3. Include a toggle button to switch status between 'Live' and 'Paused'.`,
    starterHtml: `<div class="metric-card">
  <div class="card-header">
    <h3>Active Quentrix AI Engine</h3>
    <span id="badge" class="badge active">Live</span>
  </div>
  <div class="card-body">
    <div class="counter-display">
      <span id="count">1,240</span>
      <span class="unit">assessments/min</span>
    </div>
    <div class="progress-bar">
      <div id="progress" class="progress-fill" style="width: 68%;"></div>
    </div>
  </div>
  <div class="card-footer">
    <button id="inc-btn" class="btn primary">+ Spike Load</button>
    <button id="toggle-btn" class="btn secondary">Toggle Status</button>
  </div>
</div>`,
    starterCss: `.metric-card {
  background: #30342D;
  border: 1px solid rgba(244, 240, 232, 0.12);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 400px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  color: #F4F0E8;
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
.card-header h3 {
  font-size: 1.1rem;
  margin: 0;
  color: #F4F0E8;
}
.badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  background: rgba(184, 213, 139, 0.2);
  color: #B8D58B;
  border: 1px solid #B8D58B;
}
.badge.paused {
  background: rgba(232, 197, 141, 0.2);
  color: #E8C58D;
  border-color: #E8C58D;
}
.counter-display {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}
#count {
  font-size: 2rem;
  font-weight: 700;
  color: #D87855;
}
.unit {
  font-size: 0.85rem;
  color: #B8B8AE;
}
.progress-bar {
  background: #252923;
  border-radius: 6px;
  height: 8px;
  overflow: hidden;
  margin-bottom: 1.25rem;
}
.progress-fill {
  background: linear-gradient(90deg, #D87855, #E8C58D);
  height: 100%;
  transition: width 0.3s ease;
}
.card-footer {
  display: flex;
  gap: 0.75rem;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.85rem;
}
.btn.primary {
  background: #D87855;
  color: #fff;
}
.btn.secondary {
  background: #252923;
  color: #F4F0E8;
  border: 1px solid rgba(244, 240, 232, 0.2);
}`,
    starterJs: `let currentCount = 1240;
let isLive = true;

const countEl = document.getElementById('count');
const badgeEl = document.getElementById('badge');
const progressEl = document.getElementById('progress');
const incBtn = document.getElementById('inc-btn');
const toggleBtn = document.getElementById('toggle-btn');

incBtn.addEventListener('click', () => {
  currentCount += Math.floor(Math.random() * 45) + 15;
  countEl.textContent = currentCount.toLocaleString();
  const newWidth = Math.min(100, Math.floor((currentCount / 2000) * 100));
  progressEl.style.width = newWidth + '%';
});

toggleBtn.addEventListener('click', () => {
  isLive = !isLive;
  if (isLive) {
    badgeEl.textContent = 'Live';
    badgeEl.className = 'badge active';
  } else {
    badgeEl.textContent = 'Paused';
    badgeEl.className = 'badge paused';
  }
});`
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Siddharth Rao', stream: 'Computer Science', examsCount: 18, avgPercentage: 96.4, totalScore: 890, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', badge: 'Diamond Master' },
  { rank: 2, name: 'Ananya Sharma', stream: 'Information Technology', examsCount: 16, avgPercentage: 94.8, totalScore: 865, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', badge: 'Diamond Master' },
  { rank: 3, name: 'Vikramaditya Bose', stream: 'Computer Science', examsCount: 17, avgPercentage: 92.5, totalScore: 840, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', badge: 'Platinum Pro' },
  { rank: 4, name: 'Aditya Vardhan (You)', stream: 'Computer Science', examsCount: 14, avgPercentage: 88.6, totalScore: 785, avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', isCurrentUser: true, badge: 'Code Grandmaster' },
  { rank: 5, name: 'Sneha Patel', stream: 'Electronics & Comm.', examsCount: 13, avgPercentage: 86.2, totalScore: 742, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', badge: 'Gold Scholar' },
  { rank: 6, name: 'Rohan Kulkarni', stream: 'Computer Science', examsCount: 12, avgPercentage: 84.7, totalScore: 710, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80', badge: 'Gold Scholar' },
  { rank: 7, name: 'Meera Nambiar', stream: 'Electrical & Electronics', examsCount: 14, avgPercentage: 83.1, totalScore: 695, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', badge: 'Silver Ace' },
  { rank: 8, name: 'Karthik Raja', stream: 'Mechanical Engineering', examsCount: 11, avgPercentage: 81.9, totalScore: 670, avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', badge: 'Silver Ace' }
];

export const MOCK_STUDENTS_LIST = [
  { id: 's1', name: 'Aditya Vardhan', email: 'aditya.v@quentrix.edu', stream: 'Computer Science', year: '3rd Year', examsTaken: 14, avgScore: '88.6%', status: 'Active', lastActive: '10 mins ago' },
  { id: 's2', name: 'Siddharth Rao', email: 'siddharth.r@quentrix.edu', stream: 'Computer Science', year: '4th Year', examsTaken: 18, avgScore: '96.4%', status: 'Active', lastActive: '2 hours ago' },
  { id: 's3', name: 'Ananya Sharma', email: 'ananya.s@quentrix.edu', stream: 'Information Technology', year: '3rd Year', examsTaken: 16, avgScore: '94.8%', status: 'Active', lastActive: 'Yesterday' },
  { id: 's4', name: 'Vikramaditya Bose', email: 'vikram.b@quentrix.edu', stream: 'Computer Science', year: '3rd Year', examsTaken: 17, avgScore: '92.5%', status: 'Active', lastActive: '3 days ago' },
  { id: 's5', name: 'Sneha Patel', email: 'sneha.p@quentrix.edu', stream: 'Electronics & Comm.', year: '2nd Year', examsTaken: 13, avgScore: '86.2%', status: 'Active', lastActive: '5 hours ago' },
  { id: 's6', name: 'Rohan Kulkarni', email: 'rohan.k@quentrix.edu', stream: 'Computer Science', year: '3rd Year', examsTaken: 12, avgScore: '84.7%', status: 'Inactive', lastActive: '1 week ago' },
  { id: 's7', name: 'Divya Reddy', email: 'divya.r@quentrix.edu', stream: 'Information Technology', year: '1st Year', examsTaken: 8, avgScore: '79.2%', status: 'Active', lastActive: 'Just now' },
  { id: 's8', name: 'Tanmay Joshi', email: 'tanmay.j@quentrix.edu', stream: 'Mechanical Engineering', year: '4th Year', examsTaken: 10, avgScore: '80.5%', status: 'Active', lastActive: '4 days ago' }
];

export const MOCK_PERFORMANCE_ANALYTICS = {
  overallScore: 84.5,
  totalExams: 14,
  totalQuestionsAttempted: 350,
  accuracyRate: 86.8,
  averageTimePerQuestion: '1m 24s',
  topicBreakdown: [
    { subject: 'Data Structures', topic: 'Arrays', accuracy: 85, attempted: 40, correct: 34, status: 'Strong' },
    { subject: 'Data Structures', topic: 'Linked Lists', accuracy: 60, attempted: 30, correct: 18, status: 'Moderate' },
    { subject: 'Data Structures', topic: 'Trees', accuracy: 40, attempted: 35, correct: 14, status: 'Weak' },
    { subject: 'Data Structures', topic: 'Graphs', accuracy: 75, attempted: 28, correct: 21, status: 'Strong' },
    { subject: 'Algorithms', topic: 'Dynamic Programming', accuracy: 52, attempted: 25, correct: 13, status: 'Weak' },
    { subject: 'Operating Systems', topic: 'Process Scheduling', accuracy: 92, attempted: 30, correct: 28, status: 'Strong' },
    { subject: 'Operating Systems', topic: 'Deadlocks', accuracy: 68, attempted: 22, correct: 15, status: 'Moderate' },
    { subject: 'DBMS', topic: 'SQL & Normalization', accuracy: 88, attempted: 45, correct: 40, status: 'Strong' }
  ],
  subjectMastery: [
    { subject: 'Data Structures', mastery: 72, color: '#D87855' },
    { subject: 'Algorithms', mastery: 65, color: '#B8D58B' },
    { subject: 'Operating Systems', mastery: 84, color: '#E8C58D' },
    { subject: 'Database Management', mastery: 90, color: '#82769D' },
    { subject: 'Computer Networks', mastery: 78, color: '#79B8FF' }
  ],
  scoreHistory: [
    { exam: 'Quiz 1', score: 68, avg: 62 },
    { exam: 'Midterm A', score: 74, avg: 65 },
    { exam: 'Quiz 2', score: 82, avg: 70 },
    { exam: 'Lab Exam', score: 88, avg: 72 },
    { exam: 'Assessment 3', score: 85, avg: 74 },
    { exam: 'Final Practice', score: 92, avg: 76 }
  ],
  aiDiagnosticInsights: {
    strengthsSummary: 'Outstanding grasp of memory address arithmetic, SQL joins/normal forms, and operating system scheduling algorithms.',
    criticalGaps: 'Binary search tree rotations (AVL balance factors) and overlapping subproblem formulation in Dynamic Programming need targeted practice.',
    recommendedActions: [
      'Solve 15 Tree recursion problems focused on height balance & lowest common ancestors.',
      'Review memoization vs tabulation tables for 0/1 Knapsack variations.',
      'Take a 20-minute timed AI Mock Test on Trees & Heaps to build quick-recognition patterns.'
    ],
    predictedExamScore: '87 - 91%'
  }
};

