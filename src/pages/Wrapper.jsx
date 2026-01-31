import React, { useEffect, useState } from 'react'
import supabase from '../helper/supabaseClient';
import { Navigate } from 'react-router';

function Wrapper({children}) {
    const [authenticated, setAuthenticed] = usestate(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSession = async () => {
            const {
                data: {session}
            } = await supabase.auth.getSession();
            setAuthenticed(!!session);
            setLoading(false);
        };

        getSession();
    },[]);

    if (loading) {
        return <div>Loading...</div>;
    } else {
        if (authenticated) {
            return <>{children}</>
        }
        return <Navigate to="/login" />;
    }
}

export default Wrapper;