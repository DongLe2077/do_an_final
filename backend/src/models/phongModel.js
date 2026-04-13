const db = require('../config/db.config');

const PhongModel = {
    // Lấy tất cả phòng
    getAll: async () => {
        const [rows] = await db.query(`
            SELECT p.*, t.TenToaNha 
            FROM phong p 
            LEFT JOIN toanha t ON p.MaToaNha = t.MaToaNha
        `);
        return rows;
    },

    // Lấy phòng theo MaPhong
    getById: async (MaPhong) => {
        const [rows] = await db.query(`
            SELECT p.*, t.TenToaNha 
            FROM phong p 
            LEFT JOIN toanha t ON p.MaToaNha = t.MaToaNha
            WHERE p.MaPhong = ?
        `, [MaPhong]);
        return rows[0];
    },

    // Lấy phòng theo tòa nhà
    getByToaNha: async (MaToaNha) => {
        const [rows] = await db.query('SELECT * FROM phong WHERE MaToaNha = ?', [MaToaNha]);
        return rows;
    },

    // Tạo phòng mới
    create: async (data) => {
        const { MaPhong, SoPhong, MaToanha, TrangThai, DienTich } = data;
        const [result] = await db.query(
            'INSERT INTO phong (MaPhong, SoPhong, MaToanha, TrangThai, DienTich) VALUES (?, ?, ?, ?, ?)',
            [MaPhong, SoPhong, MaToanha, TrangThai || 'Trống', DienTich]
        );
        return result.affectedRows;
    },

    // Cập nhật phòng
    update: async (MaPhong, data) => {
        const { SoPhong, MaToanha, TrangThai, DienTich } = data;
        const [result] = await db.query(
            'UPDATE phong SET SoPhong = ?, MaToanha = ?, TrangThai = ?, DienTich = ? WHERE MaPhong = ?',
            [SoPhong, MaToanha, TrangThai, DienTich, MaPhong]
        );
        return result.affectedRows;
    },

    // Xóa phòng
    delete: async (MaPhong) => {
        const [result] = await db.query('DELETE FROM phong WHERE MaPhong = ?', [MaPhong]);
        return result.affectedRows;
    }
};

module.exports = PhongModel;
