const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

// 좋아요 추가
const addLike = (req, res) => {
    const { id } = req.params;  // url론 id가 들어오기 때문에 liked_book_id라고 적으면 안됨
    const { user_id } = req.body;  // jwt 없어서

    let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?);";
    let values = [user_id, id];
    conn.query(sql, values,
        (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        return res.status(StatusCodes.OK).json(results);
    })
};

// 좋아요 삭제
const removeLike = (req, res) => {
    const { id } = req.params;  // url론 id가 들어오기 때문에 liked_book_id라고 적으면 안됨
    const { user_id } = req.body;  // jwt 없어서

    let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;";
    let values = [user_id, id];
    conn.query(sql, values,
        (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        
        return res.status(StatusCodes.OK).json(results);
    })
};

module.exports = {
    addLike,
    removeLike
};