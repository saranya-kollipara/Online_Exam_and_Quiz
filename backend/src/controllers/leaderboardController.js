import { prisma } from '../config/database.js';
import { successResponse } from '../utils/apiResponse.js';

export const leaderboardController = {
  /**
   * Retrieves verified leaderboard
   */
  async getLeaderboard(req, res, next) {
    try {
      const { streamId, type = 'global' } = req.query;
      const currentUserId = req.user?.id;

      // Group verified results by student
      const userResults = await prisma.result.findMany({
        where: {
          exam: streamId && streamId !== 'all' ? { streamId: String(streamId) } : undefined
        },
        include: {
          user: {
            include: {
              studentProfile: {
                include: { stream: true }
              }
            }
          }
        }
      });

      // Aggregate candidate scores
      const candidateMap = {};

      for (const r of userResults) {
        const uId = r.userId;
        if (!candidateMap[uId]) {
          candidateMap[uId] = {
            id: uId,
            name: `${r.user.firstName} ${r.user.lastName}`,
            stream: r.user.studentProfile?.stream?.name || 'Computer Science & Engineering',
            avatar: r.user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
            totalScore: 0,
            totalPercentage: 0,
            examsCount: 0,
            isCurrentUser: uId === currentUserId
          };
        }
        candidateMap[uId].totalScore += r.obtainedMarks;
        candidateMap[uId].totalPercentage += r.percentage;
        candidateMap[uId].examsCount++;
      }

      // Convert to ranked list
      let ranked = Object.values(candidateMap).map(c => {
        const avgPercentage = c.examsCount > 0
          ? Math.round((c.totalPercentage / c.examsCount) * 10) / 10
          : 0;

        let badge = 'Bronze Scholar';
        if (avgPercentage >= 95) badge = 'Diamond Master';
        else if (avgPercentage >= 90) badge = 'Platinum Pro';
        else if (avgPercentage >= 80) badge = 'Code Grandmaster';
        else if (avgPercentage >= 70) badge = 'Gold Scholar';
        else if (avgPercentage >= 60) badge = 'Silver Ace';

        return {
          ...c,
          totalScore: Math.round(c.totalScore),
          avgPercentage,
          badge
        };
      });

      // Sort by avgPercentage DESC, then totalScore DESC
      ranked.sort((a, b) => b.avgPercentage - a.avgPercentage || b.totalScore - a.totalScore);

      // Assign ranks with tie-breaking
      ranked = ranked.map((item, idx) => ({
        rank: idx + 1,
        ...item
      }));

      return successResponse(res, 'Academic honor leaderboard retrieved.', ranked);
    } catch (err) {
      next(err);
    }
  },

  /**
   * Stream specific leaderboard shortcut
   */
  async getStreamLeaderboard(req, res, next) {
    req.query.streamId = req.params.streamId;
    return leaderboardController.getLeaderboard(req, res, next);
  }
};

