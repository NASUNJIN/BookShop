const jwt = require('jsonwebtoken');
const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config();

// 좋아요 추가
const addLike = (req, res) => {
    const book_id = req.params.id;

    let authorization = ensureAuthorization(req);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다. 다시 로그인 해주세요."
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰 입니다."
        });
    } else {
        let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);";
        let values = [authorization.id, book_id];
        conn.query(sql, values,
            (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            return res.status(StatusCodes.OK).json(results);
        })
    }

};

// 좋아요 삭제
const removeLike = (req, res) => {
    const book_id = req.params.id;

    let authorization = ensureAuthorization(req);

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message" : "로그인 세션이 만료되었습니다. 다시 로그인 해주세요."
        });
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message" : "잘못된 토큰 입니다."
        });
    } else {
        let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";
        let values = [authorization.id, book_id];
        conn.query(sql, values,
            (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            return res.status(StatusCodes.OK).json(results);
        })
    }

};

function ensureAuthorization(req, res) {
    try {
        let receivedJwt = req.headers["authorization"];
        console.log("receivedJwt : ", receivedJwt);
    
        let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        console.log("decodedJwt : ", decodedJwt);
    
        return decodedJwt;
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = {
    addLike,
    removeLike
};