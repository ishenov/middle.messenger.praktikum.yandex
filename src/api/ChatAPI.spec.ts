// @ts-nocheck
import { expect } from 'chai';
import sinon from 'sinon';
import ChatAPI from './ChatAPI';
import HTTPTransport from '../services/HTTPTransport';

describe('ChatAPI', () => {
    let chatApi: ChatAPI;
    let httpTransportStub: sinon.SinonStub;

    beforeEach(() => {
        httpTransportStub = sinon.stub(HTTPTransport.prototype, 'delete');
        chatApi = new ChatAPI();
    });

    afterEach(() => {
        httpTransportStub.restore();
    });

    it('should call delete on HTTPTransport with correct parameters when deleteChat is called', () => {
        const chatId = 123;
        chatApi.deleteChat(chatId);
        expect(httpTransportStub.calledOnceWith('', { chatId })).to.be.true;
    });
});
