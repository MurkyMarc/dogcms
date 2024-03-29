import { useParams } from 'react-router-dom';
import { useGetDogById } from '../../hooks/useDog';

export const DogProfile = () => {
    const { id } = useParams();
    const dogProfile = useGetDogById(id!);
    return <div>Dog: {dogProfile.data?.name}</div>;
}
