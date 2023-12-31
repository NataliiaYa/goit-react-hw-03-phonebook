import { Component } from 'react';
import { nanoid } from 'nanoid';
import PropTypes from 'prop-types';
import css from './App.module.css';
import ContactForm from './ContactForm/ContactForm';
import Filter from './Filter/Filter';
import ContactList from './ContactList/ContactList';
import ContactElement from './ContactElement/ContactElement';

const CONTACTS_STORAGE = 'CONTACTS';

export class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const saveContact = localStorage.getItem(CONTACTS_STORAGE);
      if (saveContact) {
        this.setState({ contacts: JSON.parse(saveContact) });
      }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.contacts !== this.state.contacts) {
      try {
        const saveContact = JSON.stringify(this.state.contacts);
        localStorage.setItem(CONTACTS_STORAGE, saveContact);
      } catch (error) {
        console.error(error.messge);
      }
    } 
  }

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  addContact = contact => {
    const { contacts } = this.state;
    const foundContact = contacts.find(
      cont => cont.name.toLowerCase() === contact.name.toLowerCase()
    );
    if (foundContact) {
      alert(`${foundContact.name} is already in contacts.`);
      return;
    }

    contact.id = nanoid();
    this.setState(prevState => ({
      contacts: [contact, ...prevState.contacts],
    }));
  };

  handleFilterChange = evt => {
    const { name, value } = evt.currentTarget;
    this.setState({
      [name]: value,
    });
  };

  render() {
    const { filter, contacts } = this.state;
    const loFilter = filter.toLowerCase();
    const contactsCash = contacts.filter(contact => {
      return contact.name.toLowerCase().includes(loFilter);
    });

    return (
      <div className={css.phonebookArea}>
        <h3 className={css.mainTitle}>Phonebook</h3>
        <ContactForm addContact={this.addContact} />
        <h3>Contacts</h3>
        <Filter filter={filter} handleFilterChange={this.handleFilterChange} />
        <ContactList>
          <ContactElement
            contactsCash={contactsCash}
            deleteContact={this.deleteContact}
          />
        </ContactList>
      </div>
    );
  }
}

App.propTypes = {
  contact: PropTypes.objectOf(
    PropTypes.exact({
      name: PropTypes.string.isRequired,
      contacts: PropTypes.objectOf({
        name: PropTypes.string.isRequired,
        number: PropTypes.string,
      }),
    })
  ),
};

export default App;