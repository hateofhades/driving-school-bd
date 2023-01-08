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

app.get("/instructors", (req, res) => {
    const query = `SELECT * FROM Instructori`;
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
                    instructors: results
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

app.post("/addInstructor", (req, res) => {
    const { username, password, email, nume, prenume, sex, datanastere, cnp, adresa, salariu } = req.body;
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
                const queryReg = `INSERT INTO Instructori (Nume, Prenume, Sex, DataNastere, CNP, Adresa, Salariu, IDCont) VALUES ('${nume}', '${prenume}', '${sex}', '${datanastere}', '${cnp}', '${adresa}', '${salariu}', '${results.insertId}')`;
                console.log(queryReg);

                connection.query(queryReg, (err, resReg, flds) => {
                    if (err) {
                        res.status(200).json({
                            error: 500
                        });

                        console.log(err);
                        return;
                    }

                    if (resReg.affectedRows > 0) {
                        res.status(200).json({
                            error: 0
                        });
                    } else {
                        res.status(200).json({
                            error: 500
                        });
                    }
                }
                );
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

app.get("/infoElev/:username", (req, res) => {
    const query = `SELECT e.Nume, e.Prenume, e.Sex, e.DataNastere, e.CNP, e.Adresa
    FROM Elevi e JOIN Conturi c ON e.IDCont = c.IDCont
    WHERE c.Username = '${req.params.username}'`;
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
                    data: results[0]
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

app.get("/infoInstructorElev/:username", (req, res) => {
    const query = `SELECT i.Nume, i.Prenume, ic.Username
    FROM Instructori i JOIN Conturi ic ON i.IDCont = ic.IDCont
    WHERE i.IDInstructor = (SELECT e.IDInstructor FROM Conturi c JOIN Elevi e ON c.IDCont = e.IDCont WHERE c.Username = '${req.params.username}')`;
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
                    data: results[0]
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

app.get("/instructorCars/:username", (req, res) => {
    const query = `SELECT a.IDAutovehicul, a.Marca, a.Model, a.NrInmatriculare, a.AnFabricatie, a.Serie, a.Imagine
            FROM Autovehicule a JOIN InstructorAutovehicul ia ON ia.IDAutovehicul = a.IDAutovehicul
            JOIN Instructori i ON i.IDInstructor = ia.IDInstructor
            JOIN Conturi c ON c.IDCont = i.IDCont
            WHERE c.Username = "${req.params.username}"`;
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
                    data: results
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

app.post("/bookLesson", (req, res) => {
    const { IDAutovehicul, IDElev, DataOra, Locatie } = req.body;

    const query = `INSERT INTO Programari(IDAutovehicul, IDElev, DataOra, LocatieInceput) VALUES (${IDAutovehicul}, (SELECT IDElev FROM Elevi WHERE IDCont = '${IDElev}'), '${DataOra}', '${Locatie}')`;
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

app.get("/tripsElev/:username", (req, res) => {
    const query = `SELECT t.IDFoaie, t.Data, t.KmParcursi, a.Marca, a.Model, a.NrInmatriculare, a.AnFabricatie, a.Serie, a.Imagine
            FROM FoiTraseu t JOIN Autovehicule a ON t.IDAutovehicul = a.IDAutovehicul
            JOIN Elevi e ON t.IDElev = e.IDElev
            JOIN Conturi c ON c.IDCont = e.IDCont
            WHERE c.Username = "${req.params.username}"`;
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
                    data: results
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

app.get("/programariElev/:username", (req, res) => {
    const query = `SELECT p.IDProgramare, p.DataOra, p.LocatieInceput, a.Marca, a.Model, a.NrInmatriculare, a.AnFabricatie, a.Serie, a.Imagine
            FROM Programari p JOIN Autovehicule a ON p.IDAutovehicul = a.IDAutovehicul
            JOIN Elevi e ON p.IDElev = e.IDElev
            JOIN Conturi c ON c.IDCont = e.IDCont
            WHERE c.Username = "${req.params.username}"`;
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
                    data: results
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

app.delete("/programare/:id", (req, res) => {
    const query = `DELETE FROM Programari WHERE IDProgramare = ${req.params.id}`;
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

app.put("/programare", (req, res) => {
    const { IDProgramare, DataOra, LocatieInceput } = req.body;

    const query = `UPDATE Programari SET DataOra = '${DataOra}', LocatieInceput = '${LocatieInceput}' WHERE IDProgramare = ${IDProgramare}`;
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

app.get("/users", (req, res) => {
    const query = `SELECT * FROM Conturi`;
    console.log(query);

    try {
        connection.query(query, (error, results, fields) => {
            if (error) {
                res.status(200).json({
                    error: 500
                });
            } else {
                res.status(200).json({
                    error: 0,
                    data: results
                });
            }
        });
    } catch (error) {
        res.status(200).json({
            error: 500
        });
    }
});

app.delete("/user/:id", (req, res) => {
    const query = `DELETE FROM Conturi WHERE IDCont = ${req.params.id}`;
    console.log(query);

    try {
        connection.query(query, (error, results, fields) => {
            if (error) {
                res.status(200).json({
                    error: 500
                });
            } else {
                res.status(200).json({
                    error: 0
                });
            }
        });
    } catch (error) {
        res.status(200).json({
            error: 500
        });
    }
});

app.get("/students", (req, res) => {
    const query = `SELECT * FROM Elevi`;
    console.log(query);

    try {
        connection.query(query, (error, results, fields) => {
            if (error) {
                res.status(200).json({
                    error: 500
                });
            } else {
                res.status(200).json({
                    error: 0,
                    data: results
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