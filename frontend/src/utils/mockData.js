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

export const MOCK_EXAMS = [];

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

export const MOCK_LEADERBOARD = [];

export const MOCK_STUDENTS_LIST = [];

export const MOCK_PERFORMANCE_ANALYTICS = {
  overallScore: 0,
  totalExams: 0,
  totalQuestionsAttempted: 0,
  accuracyRate: 0,
  averageTimePerQuestion: '0m 00s',
  topicBreakdown: [],
  subjectMastery: [
    { subject: 'Data Structures', mastery: 0, color: '#D87855' },
    { subject: 'Algorithms', mastery: 0, color: '#B8D58B' },
    { subject: 'Operating Systems', mastery: 0, color: '#E8C58D' },
    { subject: 'Database Management', mastery: 0, color: '#82769D' },
    { subject: 'Computer Networks', mastery: 0, color: '#79B8FF' }
  ],
  scoreHistory: [],
  aiDiagnosticInsights: {
    strengthsSummary: 'Complete your first examination to generate personalized diagnostic intelligence.',
    criticalGaps: 'No evaluation gaps identified yet.',
    recommendedActions: [
      'Take a scheduled examination or practice test to begin building your skill profile.'
    ],
    predictedExamScore: 'N/A'
  }
};

