const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const expect = require('chai').expect;

const server = require('../index');

chai.use(chaiHttp);

const user = { 
    name: 'Alex',
    score: 50
    };

describe('Тестирование сервера на добавление и удаление пользователей', () => {
    
    it('Проверка добавления ползователя', (done) => {
        chai.request(server)
            .post('/api/v1//users/')
            .send(user)
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.equal('User added!');
                done();
            });
    });

    it('Проверка удаления ползователя', (done) => {
        chai.request(server)
            .delete('/api/v1/users/0')
            .end((err, res) => {
                res.should.have.status(200);
                res.text.should.be.equal('User deleted!');
                done();
            });
    });
    
    it('Проверка удаления несуществующего', (done) => {
        chai.request(server)
            .delete('/api/v1/users/4')
            .end((err, res) => {
                res.should.have.status(404);
                res.text.should.be.equal('Not Found');
                done();
            });
    });

});