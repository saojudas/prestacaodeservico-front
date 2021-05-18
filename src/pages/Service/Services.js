import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Icon, Label } from '../../Components/Typography';
import ServiceService from '../../services/ServiceService';
import ServiceForm from './ServiceForm';

export default function Search() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') ?? '';
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    try {
      const service = new ServiceService();
      const { data } = await service.getServices();
      setServices(data);
    } catch (error) {
      console.error(error);
    }
  }

  const filteredServices = services.filter(service =>
    service.title.includes(query)
  );

  function onSave(newService) {
    setServices(stService => [...stService, newService]);
  }

  return (
    <div className='p-3'>
      {query ? <Label text={`Buscando por: ${query}`} /> : null}
      <div>
        {filteredServices.map(service => (
          <Link to={`/services/${service._id}`} key={service._id}>
            <ServiceContainer className='rounded shadow mb-3 px-3 pt-3'>
              <div className='flex ml-auto justify-between'>
                <Label text={service.title} bold />
                <Stars value={service.stars} />
              </div>
              <div>
                <p>{service.description}</p>
              </div>
              <div className='mt-3 flex justify-between italic'>
                <div>
                  <Label text={`${service.value} R$`} bold />
                </div>
                <div className='flex'>
                  <Label className='mr-4' text={service.user_name} bold />
                  {service.created_at.toLocaleString()}
                </div>
              </div>
            </ServiceContainer>
          </Link>
        ))}
      </div>
      <ServiceForm onSave={onSave} />
    </div>
  );
}
const ServiceContainer = styled.div`
  background-color: ${({ theme }) => theme.white};
`;

function Stars({ value }) {
  const stars = new Array(5).fill(0).map((_, i) => i + 1 <= value);
  return (
    <div className='flex'>
      {stars.map((star, i) => (
        <Icon
          key={i}
          size='20'
          className='mr-2'
          icon={star ? 'AiFillStar' : 'AiOutlineStar'}
        />
      ))}
    </div>
  );
}