// Mainpage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Businesscard from '../components/Businesscard/Businesscard';
import ConfirmationPopup from '../components/ConfirmationPopup/ConfirmationPopup'; // Import the ConfirmationPopup component
import './Mainpage.css'; // Import the Mainpage.css file
import { FcPrevious } from "react-icons/fc";
import { FcNext } from "react-icons/fc";

function Mainpage() {
  //popup and saving functions to add a business card
  const authtoken = localStorage.getItem('token');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editCardId, setEditCardId] = useState(null);
  const [editCard, setEditCard] = useState({
    logo: '',
    name: '',
    email: '',
    phone_number: '',
    website: '',
    profession: '',
    address: '',
  });
  const [sidebarVisible, setSidebarVisible] = useState(true); // State to manage sidebar visibility
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage the confirmation popup
  const [cardToDelete, setCardToDelete] = useState(null); // State to store the ID of the card to delete
  const [businessCards, setBusinessCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(3);
  const [filter, setFilter] = useState({ profession: '' });
  const [alertMessage, setAlertMessage] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessMessageed, setShowSuccessMessageed] = useState(false);
  const professionOptions = ["Rubber Company", "Steel Company", "Plastic Company"]; 
  const handleAddClick = () => {
    setAlertMessage('')
    setShowAddPopup(true);
    setShowEditPopup(false);
    setEditCardId(null);
  };

  const handleEditClick = (id) => {
    setShowAddPopup(false);
    setAlertMessage('')
    setShowEditPopup(true);
    setEditCardId(id);
    const cardToEdit = businessCards.find((card) => card.id === id);
    setEditCard({
      logo: cardToEdit.logo,
      name: cardToEdit.name,
      email: cardToEdit.email,
      phone_number: cardToEdit.phone_number,
      website: cardToEdit.website,
      profession: cardToEdit.profession,
      address: cardToEdit.address,
    });
  };

  const [newCard, setNewCard] = useState({
    logo: '',
    name: '',
    email: '',
    phone_number: '',
    website: '',
    profession: '',
    address: '',
  });

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      setNewCard({ ...newCard, [name]: files[0] });
    } else {
      setNewCard({ ...newCard, [name]: value });
    }
  };

  const handleInputEditChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'logo') {
      // Update editCard state with the new image file
      setEditCard({ ...editCard, [name]: files[0] });
    } else {
      setEditCard({ ...editCard, [name]: value });
    }
  };

 const handleSave = async () => {
  try {
    
    // Basic form validation
    if (
      !newCard.name ||
      !newCard.email ||
      !newCard.phone_number ||
      !newCard.profession ||
      !newCard.address ||
      !newCard.logo
    ) {
      setAlertMessage('Please fill in all required fields.');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newCard.email)) {
      setAlertMessage('Please enter a valid email address.');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(newCard.phone_number)) {
      setAlertMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    const websiteRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    if (!websiteRegex.test(newCard.website)) {
      setAlertMessage('Please enter a valid website URL.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newCard.name);
    formData.append('email', newCard.email);
    formData.append('phone_number', newCard.phone_number);
    formData.append('website', newCard.website);
    formData.append('profession', newCard.profession);
    formData.append('address', newCard.address);
    formData.append('logo', newCard.logo);

    await axios.post('http://127.0.0.1:8000/api/business_cards/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + authtoken,
      },
    });

    fetchBusinessCards();
    setShowAddPopup(false);
    // Reset the newCard state
    setNewCard({
      logo: '',
      name: '',
      email: '',
      phone_number: '',
      website: '',
      profession: '',
      address: '',
    });
    
    setShowSuccessMessage(true);

    // Hide success message after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 1000);
  } catch (error) {
    console.error('Error:', error);
    // alert('Error saving the business card. Please try again later.');
    setAlertMessage('Error saving the business card. Please try again later.');

  }
};

  const handleEdit = async () => {
    try {
      if (
        !editCard.name ||
        !editCard.email ||
        !editCard.phone_number ||
        !editCard.profession ||
        !editCard.address ||
        !editCard.website 
      ) {
        setAlertMessage('Please fill in all required fields.');
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editCard.email)) {
        setAlertMessage('Please enter a valid email address.');
        return;
      }

      // Validate phone number format
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(editCard.phone_number)) {
        setAlertMessage('Please enter a valid 10-digit phone number.');
        return;
      }

      // Validate website format
      const websiteRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!websiteRegex.test(editCard.website)) {
        setAlertMessage('Please enter a valid website URL.');
        return;
      }
      const formData = new FormData();
      formData.append('name', editCard.name);
      formData.append('email', editCard.email);
      formData.append('phone_number', editCard.phone_number);
      formData.append('website', editCard.website);
      formData.append('profession', editCard.profession);
      formData.append('address', editCard.address);
      // Check if a new image is uploaded
      if (editCard.logo instanceof File) {
        formData.append('logo', editCard.logo);
      }

      await axios.put(`http://127.0.0.1:8000/api/business_cards/${editCardId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authtoken,
        },
      });

      fetchBusinessCards();
      setShowEditPopup(false);
      // Reset the editCard state
      setEditCard({
        logo: '',
        name: '',
        email: '',
        phone_number: '',
        website: '',
        profession: '',
        address: '',
      });
      setEditCardId(null);
      setShowSuccessMessageed(true)
      setTimeout(() => {
        setShowSuccessMessageed(false);
      }, 1000);
    } catch (error) {
      console.error('Error:', error.response);
      alert('Error saving the edited business card. Please try again later.');
    }
  };



  useEffect(() => {
    fetchBusinessCards();
  }, [currentPage]);

  const fetchBusinessCards = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/business_cards/?page=${currentPage}`, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + authtoken,
        },
      });
      setBusinessCards(response.data);
    } catch (error) {
      console.error('Error fetching business cards:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setCardToDelete(id);
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting the business card. Please try again later.');
    }
  };

  const confirmDelete = async () => {
    console.log("hd")
    try {
      await axios.delete(`http://127.0.0.1:8000/api/business_cards/${cardToDelete}/`, {
        headers: {
          Authorization: 'Bearer ' + authtoken,
        },
      });
      fetchBusinessCards();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Error deleting the business card. Please try again later.');
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  // logout function
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      window.location.href = '/login';
    }
  }, []);

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };


  // Handle input change for filtering
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilter({ ...filter, [name]: value });
  };
  // Filter business cards based on the filter criteria
  const filteredCards = businessCards.filter((card) => {
    return card.profession.toLowerCase().includes(filter.profession.toLowerCase());
  });




  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  // const currentCards = businessCards.slice(indexOfFirstCard, indexOfLastCard);
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);


  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <div className="fluid-container">
      <header>
        <button className='custom-button' onClick={toggleSidebar}>Busness Management</button>
        <button className='custom-button' onClick={handleLogoutClick}>Logout</button>
      </header>
      <div className="content">
        <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
          <div>
            <button className='custom-button' onClick={handleAddClick}>Add Cards</button>
          </div>
          <div>
            <label>Filter by Profession:</label>
            <select name="profession" value={filter.profession} onChange={handleFilterChange}>
          <option value="">All</option>
          {professionOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
          </div>
        </div>

        <div className="main-content">
          <div className="business-card-container">
            {currentCards.map((card) => (
              <Businesscard
                key={card.id}
                card={card}
                handleEdit={() => handleEditClick(card.id)}
                handleDelete={() => handleDelete(card.id)} />
            ))}
          </div>

          <div className="pagination">
            <button  className='custom-button' onClick={handlePreviousPage} disabled={currentPage === 1}><FcPrevious /></button>
            <span>{currentPage}</span>
            <button  className='custom-button' onClick={handleNextPage} disabled={currentCards.length < cardsPerPage}><FcNext /></button>
          </div>

          {showAddPopup && (
            <div className="popup">
              <div className="popup-inner">
                <h2>Add New Business Card</h2>
                
                <div>
                  <label>Logo URL:</label>
                  <input type="file" name="logo" onChange={handleInputChange} />
                </div>
                <div>
                  <label>Name:</label>
                  <input type="text" name="name" value={newCard.name} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Email:</label>
                  <input type="text" name="email" value={newCard.email} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Phone:</label>
                  <input type="text" name="phone_number" value={newCard.phone_number} onChange={handleInputChange} />
                </div>
                <div>
                  <label>Website:</label>
                  <input type="text" name="website" value={newCard.website} onChange={handleInputChange} />
                </div>

                <div>
              <label>Profession:</label>
              <select name="profession" value={newCard.profession} onChange={handleInputChange}>
                <option value="">Select Profession</option>
                {professionOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
              </div>


                <div>
                  <label>Address:</label>
                  <input type="text" name="address" value={newCard.address} onChange={handleInputChange} />
                </div>
                {alertMessage && <div className="alert">{alertMessage}</div>}
                <div>
                  <button className='custom-button' onClick={handleSave}>Save</button>
                  <button className='custom-button' onClick={() => setShowAddPopup(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {showEditPopup && (
            <div className="popup">
              <div className="popup-inner">
                <h2>Edit Business Card</h2>
                <div>
                  <label>Logo URL:</label>
                  <input type="file" name="logo" onChange={handleInputEditChange} />
                </div>
                <div>
                  <label>Name:</label>
                  <input type="text" name="name" value={editCard.name} onChange={handleInputEditChange} />
                </div>
                <div>
                  <label>Email:</label>
                  <input type="text" name="email" value={editCard.email} onChange={handleInputEditChange} />
                </div>
                <div>
                  <label>Phone:</label>
                  <input type="text" name="phone_number" value={editCard.phone_number} onChange={handleInputEditChange} />
                </div>
                <div>
                  <label>Website:</label>
                  <input type="text" name="website" value={editCard.website} onChange={handleInputEditChange} />
                </div>
                <div>
              <label>Profession:</label>
              <select name="profession" value={editCard.profession} onChange={handleInputEditChange}>
                <option value="">Select Profession</option>
                {professionOptions.map((option, index) => (
                  <option key={index} value={option}>{option}</option>
                ))}
              </select>
            </div>
                <div>
                  <label>Address:</label>
                  <input type="text" name="address" value={editCard.address} onChange={handleInputEditChange} />
                </div>
                {alertMessage && <div className="alert">{alertMessage}</div>}
                <div>
                  <button className='custom-button' onClick={handleEdit}>Save</button>
                  <button className='custom-button' onClick={() => setShowEditPopup(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {showConfirmation && (
            <ConfirmationPopup
              message="Are you sure you want to delete this card?"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}
        </div>
      </div>
      {showSuccessMessage && (
  <div>
    <div className="success-overlay"></div>
    <div className="success-message">Data successfully added!</div>
  </div>
)}
  {showSuccessMessageed && (
  <div>
    <div className="success-overlay"></div>
    <div className="success-message">Data successfully modified!</div>
  </div>
)}
    </div>
  );
}

export default Mainpage;
