import express from 'express';
const app = express();
import cors from 'cors';
import * as path from "path";
import * as dotenv from "dotenv";
import * as mysql from 'mysql';
const port = 3000;

const allowedOrigins = [
    'http://localhost:8080',
];

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bd_proiect'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to Db');
        return;
    }

    console.log('Connection established');
});

dotenv.config({ path: path.join(__dirname, ".env") });

app.use(cors({
    origin: allowedOrigins,
    credentials: false
}));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM Conturi WHERE Username = '${username}' AND Parola = '${password}'`;
    console.log(query);

    try {
        connection.query(query, (error, results, fields) => {
            if (error) {
                res.status(200).json({
                    error: 500
                });

                console.log(error);
                return;
            }

            if (results.length > 0) {
                res.status(200).json({
                    error: 0,
                    user: results[0]
                });
            } else {
                res.status(200).json({
                    error: 401
                });
            }
        });
    } catch (error) {
        res.status(200).json({
            error: 500
        });

        console.log(error);
    }
});

app.post('/register', (req, res) => {
    const { username, password, email, nume, prenume, sex, datanastere, cnp, adresa, idinstructor } = req.body;

    const query = `INSERT INTO Conturi (Username, Parola, Email) VALUES ('${username}', '${password}', '${email}')`;
    console.log(query);

    try {
        connection.query(query, (error, results, fields) => {
            if (error) {
                res.status(200).json({
                    error: 500
                });

                console.log(error);
                return;
            }

            if (results.affectedRows > 0) {
                const queryReg = `INSERT INTO Elevi (Nume, Prenume, Sex, DataNastere, CNP, Adresa, IDCont, IDInstructor) VALUES ('${nume}', '${prenume}', '${sex}', '${datanastere}', '${cnp}', '${adresa}', '${results.insertId}', '${idinstructor}')`;

                connection.query(queryReg);

                res.status(200).json({
                    error: 0
                });
            } else {
                res.status(200).json({
                    error: 500
                });
            }
        });
    } catch (error) {
        res.status(200).json({
            error: 500
        });

        console.log(error);
    }
});

app.post('/changePassword', (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    const query = `UPDATE Conturi SET Parola = '${newPassword}' WHERE Username = '${username}' AND Parola = '${oldPassword}'`;
    console.log(query);

    try {
        connection.query(query, (error, results, fields) => {
            if (error) {
                res.status(200).json({
                    error: 500
                });

                console.log(error);
                return;
            }

            if (results.affectedRows > 0) {
                res.status(200).json({
                    error: 0
                });
            } else {
                res.status(200).json({
                    error: 401
                });
            }
        });
    } catch (error) {
        res.status(200).json({
            error: 500
        });
    }
});

app.post('/deleteAccount', (req, res) => {
    const { username, password } = req.body;

    const query = `DELETE FROM Conturi WHERE Username = '${username}' AND Parola = '${password}'`;
    console.log(query);

    try {
        connection.query(query, (error, results, fields) => {
            if (error) {
                res.status(200).json({
                    error: 500
                });

                console.log(error);
                return;
            }

            if (results.affectedRows > 0) {
                res.status(200).json({
                    error: 0
                });
            } else {
                res.status(200).json({
                    error: 401
                });
            }
        });
    } catch (error) {
        res.status(200).json({
            error: 500
        });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});