/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: Match management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateMatchDto:
 *       type: object
 *       required:
 *         - teamA
 *         - teamB
 *         - match_date
 *         - format
 *         - venue
 *         - status
 *       properties:
 *         teamA:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: string
 *               example: "Mumbai Indians"
 *             short_name:
 *               type: string
 *               example: "MI"
 *             logo_url:
 *               type: string
 *               example: "https://example.com/mi-logo.png"
 *             location:
 *               type: string
 *               example: "Mumbai"
 *         teamB:
 *           type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: string
 *               example: "Chennai Super Kings"
 *             short_name:
 *               type: string
 *               example: "CSK"
 *             logo_url:
 *               type: string
 *               example: "https://example.com/csk-logo.png"
 *             location:
 *               type: string
 *               example: "Chennai"
 *         match_date:
 *           type: string
 *           format: date-time
 *           example: "2023-10-25T14:30:00Z"
 *         format:
 *           type: string
 *           example: "T20"
 *         venue:
 *           type: string
 *           example: "Wankhede Stadium, Mumbai"
 *         status:
 *           type: string
 *           enum: [SCHEDULED, ONGOING, COMPLETED, CANCELLED]
 *           example: "SCHEDULED"
 *     UpdateMatchDto:
 *       type: object
 *       properties:
 *         match_date:
 *           type: string
 *           format: date-time
 *         format:
 *           type: string
 *         venue:
 *           type: string
 *         status:
 *           type: string
 *           enum: [SCHEDULED, ONGOING, COMPLETED, CANCELLED]
 *         team_a_id:
 *           type: integer
 *         team_b_id:
 *           type: integer
 *     MatchResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         team_a_id:
 *           type: integer
 *           example: 1
 *         team_b_id:
 *           type: integer
 *           example: 2
 *         match_date:
 *           type: string
 *           format: date-time
 *           example: "2023-10-25T14:30:00Z"
 *         format:
 *           type: string
 *           example: "T20"
 *         venue:
 *           type: string
 *           example: "Wankhede Stadium, Mumbai"
 *         status:
 *           type: string
 *           example: "SCHEDULED"
 *         is_active:
 *           type: boolean
 *           example: true
 *         tenant_id:
 *           type: integer
 *           example: 1
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         teamA:
 *           $ref: '#/components/schemas/TeamResponseDto'
 *         teamB:
 *           $ref: '#/components/schemas/TeamResponseDto'
 */

/**
 * @swagger
 * /matches:
 *   post:
 *     summary: Create a new match
 *     description: Creates a new match. Checks if teams exist by name; if not, creates them.
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMatchDto'
 *     responses:
 *       201:
 *         description: Match created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Match created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/MatchResponse'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   get:
 *     summary: Get all matches
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of matches
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Matches retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MatchResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /matches/{id}:
 *   get:
 *     summary: Get match by ID
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Match details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Match retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/MatchResponse'
 *       404:
 *         description: Match not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   patch:
 *     summary: Update match
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMatchDto'
 *     responses:
 *       200:
 *         description: Match updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Match updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/MatchResponse'
 *       404:
 *         description: Match not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   delete:
 *     summary: Delete match
 *     tags: [Matches]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Match deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Match deleted successfully"
 *       404:
 *         description: Match not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
