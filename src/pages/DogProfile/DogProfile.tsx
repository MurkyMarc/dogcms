import { useParams } from 'react-router-dom';

export const DogProfile = () => {
    const { id } = useParams();
    return <div>Dog ID: {id}</div>;
}
