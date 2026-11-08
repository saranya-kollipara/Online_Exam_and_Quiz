import axios from 'axios';
import { prisma } from '../config/database.js';
import { aiConfig } from '../config/ai.js';
import { logger } from '../utils/logger.js';

export const chatbotService = {
  /**
   * Processes a student academic inquiry in English or Telugu
   */
  async processQuery({ userId, message, conversationId = null, language = 'en' }) {
    // 1. Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await prisma.chatConversation.findUnique({
        where: { id: conversationId }
      });
    }

    if (!conversation) {
      conversation = await prisma.chatConversation.create({
        data: {
          userId,
          title: message.slice(0, 40) + '...',
          language
        }
      });
    }

    // 2. Save User Message
    await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderRole: 'user',
        content: message,
        language
      }
    });

    // 3. Generate response using AI API or specialized engineering knowledge bank
    const isTelugu = language === 'te' || /[\u0C00-\u0C7F]/.test(message);
    let replyContent = '';

    if (aiConfig.apiKey && aiConfig.provider !== 'mock') {
      try {
        replyContent = await this._callAiTutor(message, isTelugu ? 'Telugu' : 'English');
      } catch (err) {
        logger.warn('AI chatbot API call failed: ' + err.message);
        replyContent = this._getDomainKnowledgeReply(message, isTelugu);
      }
    } else {
      replyContent = this._getDomainKnowledgeReply(message, isTelugu);
    }

    // 4. Save Assistant Message
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        conversationId: conversation.id,
        senderRole: 'assistant',
        content: replyContent,
        language: isTelugu ? 'te' : 'en'
      }
    });

    return {
      conversationId: conversation.id,
      message: assistantMessage
    };
  },

  /**
   * Retrieves conversation history
   */
  async getConversationHistory(userId, conversationId = null) {
    if (conversationId) {
      return prisma.chatConversation.findUnique({
        where: { id: conversationId },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        }
      });
    }

    return prisma.chatConversation.findMany({
      where: { userId },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 20
    });
  },

  /**
   * Internal caller for Gemini/OpenAI
   */
  async _callAiTutor(message, languageName) {
    const systemPrompt = `You are Quentrix AI, an elite university engineering and technical examination tutor.
Answer the student's question accurately with step-by-step logic, code snippets if applicable, time/space complexity, and formula derivations.
Language: Respond in ${languageName}. Keep the tone polite, encouraging, and academic.`;

    if (aiConfig.provider === 'gemini') {
      const url = `${aiConfig.geminiEndpoint}/${aiConfig.model}:generateContent?key=${aiConfig.apiKey}`;
      const response = await axios.post(url, {
        contents: [
          { parts: [{ text: `${systemPrompt}\n\nStudent Query: ${message}` }] }
        ]
      }, { timeout: 15000 });

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
    } else {
      const response = await axios.post(aiConfig.openaiEndpoint, {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.3
      }, {
        headers: { Authorization: `Bearer ${aiConfig.apiKey}` },
        timeout: 15000
      });

      return response.data.choices[0].message.content;
    }
  },

  /**
   * Intelligent bilingual domain knowledge base
   */
  _getDomainKnowledgeReply(message, isTelugu) {
    const lower = message.toLowerCase();

    if (isTelugu) {
      if (lower.includes('tree') || lower.includes('ట్రీ') || lower.includes('చెట్టు')) {
        return `**బైనరీ ట్రీ (Binary Tree) సమగ్ర వివరణ:**

బైనరీ ట్రీ అనేది ఒక సోపానక్రమ డేటా నిర్మాణం (Hierarchical Data Structure), ఇందులో ప్రతి పేరెంట్ నోడ్‌కు గరిష్టంగా **రెండు చైల్డ్ నోడ్స్** మాత్రమే ఉంటాయి:
1. **ఎడమ చైల్డ్ (Left Child)**
2. **కుడి చైల్డ్ (Right Child)**

\`\`\`c
struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};
\`\`\`

**ముఖ్యమైన గణాంకాలు:**
- ఎత్తు $h$ కలిగిన బైనరీ ట్రీలో గరిష్ట నోడ్స్: $2^{h+1} - 1$
- BST లో సెర్చ్ సమయ సంక్లిష్టత: సగటున $O(\\log n)$
- ఇన్-ఆర్డర్ ట్రావర్సల్ (In-order Traversal) BST లో ఎలిమెంట్స్‌ను క్రమబద్ధీకరించిన క్రమంలో (Ascending order) ఇస్తుంది.`;
      }

      if (lower.includes('exam') || lower.includes('పరీక్ష') || lower.includes('prepare') || lower.includes('strategy')) {
        return `**క్వెం ట్రిక్స్ AI (Quentrix AI) పరీక్ష సన్నాహక మార్గదర్శకాలు:**

1. **కాన్సెప్ట్ క్లారిటీ:** ఫార్ములాలు మరియు రికర్షన్ బౌండరీలను క్షుణ్ణంగా అర్థం చేసుకోండి.
2. **నెగెటివ్ మార్కింగ్ జాగ్రత్త:** సమాధానం పూర్తిగా తెలియకపోతే వదిలివేయడం శ్రేయస్కరం.
3. **AI మాక్ టెస్ట్‌లు:** రోజూ 20 నిమిషాల మాక్ టెస్ట్ సాధన చేయడం ద్వారా మీ లోపాలను సరిదిద్దుకోవచ్చు.`;
      }

      return `నమస్కారం! నేను **Quentrix AI అకాడెమిక్ అసిస్టెంట్‌ని**. ఇంజనీరింగ్ డేటా స్ట్రక్చర్స్, ఆపరేటింగ్ సిస్టమ్స్, ప్రోగ్రామింగ్ సమస్యలు లేదా పరీక్షల సన్నాహాలకు సంబంధించి మీకు ఎలా సహాయపడగలను?`;
    }

    // English Handlers
    if (lower.includes('avl') || lower.includes('balance factor') || lower.includes('rotation')) {
      return `### AVL Tree Balance Factor & Rotations

An **AVL Tree** is a strictly self-balancing Binary Search Tree where the difference between heights of left and right subtrees for any node is at most **1**.

$$\\text{Balance Factor } BF(k) = \\text{height}(\\text{left}) - \\text{height}(\\text{right}) \\in \\{-1, 0, 1\\}$$

When an insertion causes $|BF| > 1$, we restore balance using 4 canonical rotation cases:
1. **Left-Left (LL)**: Single Right Rotation
2. **Right-Right (RR)**: Single Left Rotation
3. **Left-Right (LR)**: Left rotation on left child $\\rightarrow$ Right rotation on root
4. **Right-Left (RL)**: Right rotation on right child $\\rightarrow$ Left rotation on root

\`\`\`cpp
Node* rotateRight(Node* y) {
    Node* x = y->left;
    Node* T2 = x->right;
    x->right = y;
    y->left = T2;
    y->height = 1 + std::max(getHeight(y->left), getHeight(y->right));
    x->height = 1 + std::max(getHeight(x->left), getHeight(x->right));
    return x;
}
\`\`\`
Time Complexity: Guaranteed **$O(\\log n)$** worst-case search, insert, and delete.`;
    }

    if (lower.includes('deadlock') || lower.includes('banker') || lower.includes('semaphore')) {
      return `### Operating Systems: Deadlock & Prevention

A **Deadlock** occurs when a set of concurrent processes are permanently blocked because each process holds a resource and waits for another held by another process.

#### 4 Necessary Coffman Conditions:
1. **Mutual Exclusion**: Non-shareable resource.
2. **Hold and Wait**: Process holding resources requests additional ones.
3. **No Preemption**: Resources cannot be forcibly revoked.
4. **Circular Wait**: Closed chain of processes waiting for each other.

To prevent deadlock, eliminate at least one condition. For deadlock avoidance, use **Banker's Algorithm**:
$$\\text{Need}[i][j] = \\text{Max}[i][j] - \\text{Allocation}[i][j]$$`;
    }

    return `Hello! I am **Quentrix AI**, your intelligent academic companion and technical assessment tutor.

I can help you with:
- **Core Engineering Concepts**: Data Structures, Algorithms, OS, DBMS, Networks, and Web Dev.
- **Code Optimization & Debugging**: C, C++, Java, Python, and JavaScript.
- **Exam Preparation Strategy**: Mock tests, negative marking formulas, and formula revisions.
- **Bilingual Tutoring**: Ask me questions in **English** or **Telugu (తెలుగు)**!

How would you like to level up your engineering practice today?`;
  }
};

