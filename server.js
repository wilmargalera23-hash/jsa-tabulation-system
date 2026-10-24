const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });

// ✅ RE-PLANTSADONG COMPACT CONFIGURATION: Purong cloud domain parameters lang safely nang walang :// symbols!
const dbConfig = {
    host: 'mysql-24667728-pageant.c.aivencloud.com',
    port: 17439,
    user: 'avnadmin',
    password: 'AVNS_NACtG7Ht7GVRAEYY-f_',
    database: 'defaultdb',
    ssl: { rejectUnauthorized: false }, 
    waitForConnections: true,
    connectionLimit: 20
};

let db;
async function connectDatabase() {
    try {
        db = await mysql.createPool(dbConfig);
        console.log("💾 Pageant cloud database connection handshake authorized successfully!");
        
        // 🚀 A. AUTOMATED TABLES CREATOR GATEWAY
        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`candidates\` (
              \`id\` int(11) NOT NULL AUTO_INCREMENT,
              \`name\` varchar(255) NOT NULL,
              \`candidate_number\` int(11) NOT NULL,
              \`representation\` varchar(255) NOT NULL,
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `).catch(() => {});

        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`categories\` (
              \`id\` int(11) NOT NULL AUTO_INCREMENT,
              \`category_name\` varchar(255) NOT NULL,
              \`max_score\` int(11) DEFAULT 100,
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `).catch(() => {});

        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`judges\` (
              \`id\` int(11) NOT NULL AUTO_INCREMENT,
              \`judge_name\` varchar(255) NOT NULL,
              \`access_code\` varchar(50) NOT NULL,
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `).catch(() => {});

        await db.execute(`
            CREATE TABLE IF NOT EXISTS \`scores\` (
              \`id\` int(11) NOT NULL AUTO_INCREMENT,
              \`judge_id\` int(11) NOT NULL,
              \`candidate_id\` int(11) NOT NULL,
              \`category_id\` int(11) NOT NULL,
              \`score_given\` decimal(5,2) NOT NULL,
              PRIMARY KEY (\`id\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `).catch(() => {});

        // 🚀 B. AUTOMATED CLOUD DATA RESTORATION ARRAY SEEDERS
        const [candCheck] = await db.execute("SELECT COUNT(*) as total FROM candidates");
        if (candCheck.total === 0) {
            await db.execute("INSERT INTO candidates (id, name, candidate_number, representation) VALUES (5, 'MARIAN RIVERA', 1, 'CAVITE'), (6, 'ANGEL LOCSIN', 2, 'BULACAN'), (7, 'CATRIONA GRAY', 3, 'OAS, ALBAY'), (12, 'GAZINI GANADOS', 4, 'CEBU')");
        }

        const [catCheck] = await db.execute("SELECT COUNT(*) as total FROM categories");
        if (catCheck.total === 0) {
            await db.execute("INSERT INTO categories (id, category_name, max_score) VALUES (6, 'Swimwear Competition', 100), (7, 'Evening Gown Competition', 100), (8, 'Interview Segment', 100)");
        }

        const [judgeCheck] = await db.execute("SELECT COUNT(*) as total FROM judges");
        if (judgeCheck.total === 0) {
            const thirtyJudgesLineup = [
                [1, 'Hon. Maria Theresa R. Cruz', 'judge1'], [2, 'Dr. Alejandro G. Santos', 'judge2'], [3, 'Engr. Robert C. Bautista', 'judge3'],
                [4, 'Prof. Evelyn T. Soriano', 'judge4'], [5, 'Atty. Fernando M. Jose', 'judge5'], [6, 'Dr. Christina H. Lopez', 'judge6'],
                [7, 'Arch. Manuel S. Valenzuela', 'judge7'], [8, 'Capt. Antonio K. Dimaculangan', 'judge8'], [9, 'Ms. Samantha Mae L. Aquino', 'judge9'],
                [10, 'Hon. Ricardo P. Dela Cruz', 'judge10'], [11, 'Dr. Jonathan E. Ramirez', 'judge11'], [12, 'Prof. Ma. Clarissa V. Ngo', 'judge12'],
                [13, 'Engr. David Timothy S. Almeda', 'judge13'], [14, 'Atty. Beatrice Jane C. Luna', 'judge14'], [15, 'Hon. Wilfredo G. Panganiban', 'judge15'],
                [16, 'Ms. Patricia Nicole R. Reyes', 'judge16'], [17, 'Mr. Christopher John D. Silva', 'judge17'], [18, 'Dr. Elizabeth Anne S. Castro', 'judge18'],
                [19, 'Prof. Roderick M. Del Rosario', 'judge19'], [20, 'Engr. Katrina Bianca F. Tiongson', 'judge20'], [21, 'Atty. Michael Angelo G. Peralta', 'judge21'],
                [22, 'Hon. Sophia Marie L. Mendoza', 'judge22'], [23, 'Dr. Benjamin Joseph K. Tan', 'judge23'], [24, 'Ms. Danielle Joyce P. Co', 'judge24'],
                [25, 'Mr. Emmanuel Vance S. Guinto', 'judge25'], [26, 'Prof. Rowena Faith T. Lim', 'judge26'], [27, 'Engr. Gabriel Luis M. Santos', 'judge27'],
                [28, 'Atty. Veronica Ashley R. Pascual', 'judge28'], [29, 'Hon. Jose Maria C. Hernandez', 'judge29'], [30, 'Hon. Chief Justice Evaluation Panel', 'judge30']
            ];
            for (let j of thirtyJudgesLineup) {
                await db.execute("INSERT INTO judges (id, judge_name, access_code) VALUES (?, ?, ?)", j).catch(() => {});
            }
            console.log("👑 CLOUD DATABASE RESTORED: All 30 Judges and candidates successfully active!");
        }
    } catch (error) {
        console.log("⚠️ Cloud Database Connection Loop Fail: ", error.message);
    }
}
connectDatabase();

// 📡 CORE API LINK CONTROLLER ENDPOINTS
app.get(['/api/initial-data', '/initial-data'], async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const [candRows] = await db.execute("SELECT * FROM candidates ORDER BY candidate_number ASC");
        const [catRows] = await db.execute("SELECT * FROM categories ORDER BY id ASC");
        const [judgeRows] = await db.execute("SELECT * FROM judges ORDER BY id ASC");
        const [scoreRows] = await db.execute("SELECT * FROM scores");
        
        return res.json({ candidates: candRows, categories: catRows, judges: judgeRows, scores: scoreRows });
    } catch(e) {
        return res.json({ candidates: [], categories: [], judges: [], scores: [] });
    }
});

app.get(['/api/admin/live-logs', '/admin/live-logs'], async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const [rows] = await db.execute(`
            SELECT s.id, s.judge_id, s.score_given,
                   COALESCE(j.judge_name, CONCAT('Official Judge #', s.judge_id)) AS judge_name,
                   c.candidate_number AS candidate_number, s.candidate_id AS candidate_row_id,
                   cat.id AS category_id, cat.category_name AS category_name, c.name AS candidate_name
            FROM scores s
            INNER JOIN candidates c ON s.candidate_id = c.id
            INNER JOIN categories cat ON s.category_id = cat.id
            LEFT JOIN judges j ON s.judge_id = j.id
            ORDER BY s.id DESC
        `);
        return res.json(rows);
    } catch (error) {
        return res.json([]);
    }
});

app.post(['/api/scores', '/scores'], async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        const { judge_id, candidate_id, category_id, score_given } = req.body;
        
        const [exist] = await db.execute("SELECT id FROM scores WHERE judge_id = ? AND candidate_id = ? AND category_id = ?", [judge_id, candidate_id, category_id]);
        if (exist.length > 0) {
            await db.execute("UPDATE scores SET score_given = ? WHERE id = ?", [score_given, exist[0].id]);
        } else {
            await db.execute("INSERT INTO scores (judge_id, candidate_id, category_id, score_given) VALUES (?, ?, ?, ?)", [judge_id, candidate_id, category_id, score_given]);
        }
        
        io.emit('score_updated');
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.post('/api/system/reset-scores', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        await db.execute("TRUNCATE TABLE scores");
        io.emit('score_updated');
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.post('/api/system/reset-judges', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    try {
        await db.execute("SET FOREIGN_KEY_CHECKS = 0");
        await db.execute("TRUNCATE TABLE scores");
        await db.execute("TRUNCATE TABLE judges");
        await db.execute("SET FOREIGN_KEY_CHECKS = 1");
        io.emit('score_updated');
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

app.get(['/api/candidates', '/candidates'], async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM candidates ORDER BY candidate_number ASC");
        res.json(rows);
    } catch(e) { res.json([]); }
});

app.get(['/api/criteria', '/criteria'], async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM categories ORDER BY id ASC");
        res.json(rows);
    } catch(e) { res.json([]); }
});

app.get(['/api/judges', '/judges'], async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM judges ORDER BY id ASC");
        res.json(rows);
    } catch(e) { res.json([]); }
});

// 🚀 WIRELESS DYNAMIC LISTENER PORTS FOR RENDER DEPLOYMENTS
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Tabulation Backend Server Core Engine broadcasting safely on port ${PORT}`);
});
