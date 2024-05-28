const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

// (카테고리 별, 신간 여부) 전체 도서 조회
const allBooks = (req, res) => {
    // newBoks : 신간, limit : page당 도서 수, currentPage : 현재 페이지
    let { category_id, newBooks, limit, currentPage } = req.query;   
    // offset = limit * (currentPage - 1)
    let offset = limit * (currentPage - 1);

    let sql = "SELECT * FROM books";
    let values = [];
    if (category_id && newBooks){   // 카테고리와 신간을 찾을 경우
        sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 7 MONTH) AND NOW()";
        values = [category_id];
    } else if (category_id) {       // 카테고리만 볼 경우
        sql += " WHERE category_id = ?";
        values = [category_id];
    } else if (newBooks) {         // 신간만 볼 경우
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 7 MONTH) AND NOW()";
    }

    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset)

    conn.query(sql, values,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            
            // results 값이 있을 경우
            if (results.length) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
    })
};

// 개별 도서 조회
const bookDetail = (req, res) => {
    let { id } = req.params;


    let sql = `SELECT * FROM books LEFT JOIN category 
                ON books.category_id = category.id WHERE books.id = ?;`;
    conn.query(sql, id,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results[0]) {
                return res.status(StatusCodes.OK).json(results[0]);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
            
    })
};

module.exports = {
    allBooks,
    bookDetail
};