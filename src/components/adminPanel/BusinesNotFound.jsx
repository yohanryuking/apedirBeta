import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/client';
import BusinessProfile from './BusinessProfile';
import NotBusiness from './NotBusiness';

const BusinesNotFound = () => {
    const [hasBusiness, setHasBusiness] = useState(true);
    const [sessionId, setSessionId] = useState(null);

    useEffect(() => {
        const getSession = async () => {
            const user = await supabase.auth.getUser();
            setSessionId(user.data.user.id);
        }
        getSession();

    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            console.log(sessionId);
            const { data, error } = await supabase
                .from('users')
                .select('business')
                .eq('id', sessionId);

            if (error) {
                console.error(error);
            } else {
                // setHasBusiness(data[0].business);
                console.log(data[0].business);
            }
        };
        fetchUser();
    }, [sessionId]);

    return (
        <div>
            {hasBusiness ? <BusinessProfile /> : <NotBusiness />}
            {/* {hasBusiness ? <p>tiene</p>: <p>no tiene</p>} */}
        </div>
    );
};

export default BusinesNotFound;
