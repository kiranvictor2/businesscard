import React from 'react';
import '../Businesscard/Businesscard.css';
import { imageUrl } from '../../Constants/constants';


import { FaPhone } from "react-icons/fa6";
import { FaRegAddressBook } from "react-icons/fa";
import { BsSuitcaseLg } from "react-icons/bs";
import { MdOutlineEmail } from "react-icons/md";
import { MdDomain } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";

const Businesscard = ({ card, handleEdit,handleDelete }) => {
    const logoUrl = `${imageUrl}${card.logo}`;
    return (
        <div className='col-lg-4 col-sm-12'>
            <div className="business-card">
                <div className='data-hol'>
                    <h2>{card.name}</h2>
                    <p><MdOutlineEmail /> {card.email}</p>
                    <p><FaPhone />{card.phone_number}</p>
                    <p><MdDomain /><a href="{card.website}"> Click here</a></p>
                    <p><BsSuitcaseLg /> {card.profession}</p>
                    <p><FaRegAddressBook />: {card.address}</p>
                </div>
                <div className='imag-hol'>
                    <img src={logoUrl} alt="Logo" />
                </div>
                <div className='edi-del'>
                    <button className='custom-icon' onClick={handleEdit}><FaEdit /></button>
                    <button  className='custom-icon' onClick={handleDelete}><MdOutlineDelete /></button>
                </div>
            </div>

        </div>
    );
};

export default Businesscard;
