// @ts-nocheck
import { expect } from 'chai';
import sinon from 'sinon';
import { AddUserModal } from './index';

describe('AddUserModal Component', () => {
    let addUserModal: AddUserModal;
    let onSearchSpy: sinon.SinonSpy;
    let onCloseSpy: sinon.SinonSpy;
    let onAddUserToChatSpy: sinon.SinonSpy;

    beforeEach(() => {
        onSearchSpy = sinon.spy();
        onCloseSpy = sinon.spy();
        onAddUserToChatSpy = sinon.spy();

        addUserModal = new AddUserModal({
            isOpen: false,
            onSearch: onSearchSpy,
            onClose: onCloseSpy,
            onAddUserToChat: onAddUserToChatSpy,
        });
    });

    it('should not be visible when isOpen is false', () => {
        expect(addUserModal.props.isOpen).to.be.false;
    });

    it('should be visible when isOpen is true', () => {
        addUserModal.setProps({ isOpen: true });
        expect(addUserModal.props.isOpen).to.be.true;
    });

    it('should call onClose when close is called', () => {
        addUserModal.close();
        expect(onCloseSpy.calledOnce).to.be.true;
    });

    it('should clear search results when open is called', () => {
        addUserModal.setProps({ searchResults: [{ id: 1, login: 'test', first_name: 'test', second_name: 'test', display_name: 'test', avatar: null }] });
        addUserModal.open();
        expect(addUserModal.props.searchResults).to.be.empty;
    });

    it('should render search results', () => {
        const users = [{ id: 1, login: 'test', first_name: 'test', second_name: 'test', display_name: 'test', avatar: null }];
        addUserModal.setProps({ searchResults: users });
        const rendered = addUserModal.render();
        expect(rendered).to.include('test');
    });
});
