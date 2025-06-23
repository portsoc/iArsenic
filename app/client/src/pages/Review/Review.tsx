import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { navigate } from 'wouter/use-browser-location';
import { Well } from 'iarsenic-types';
import { useRoute } from 'wouter';
import Depth from './Depth';
import Flooding from './Flooding';
import Region from './Region';
import Staining from './Staining';
import Drinking from './Drinking';
import Images from './Images';
import { useAccessToken } from '../../utils/useAccessToken';
import WellDataEntryLayout from "../../components/WellDataEntryLayout";
import TranslatableText from '../../components/TranslatableText';

export default function Review(): JSX.Element {
    const [, params] = useRoute('/well/:id/review');
    const wellId = params?.id;
    const [well, setWell] = useState<Well>();
    const { data: token } = useAccessToken();

    useEffect(() => {
        async function fetchWell() {
            if (!wellId) return;

            const headers: HeadersInit = {};
            if (token) {
                headers['authorization'] = `Bearer ${token.id}`;
            }

            const result = await fetch(`/api/v1/self/well/${wellId}`, {
                headers,
            });

            if (!result.ok) {
                console.error('Failed to fetch well:', result);
                return;
            }

            const well = await result.json();
            setWell(well);
        }

        fetchWell();
    }, [token, wellId]);

    if (!well) {
        return <CircularProgress />;
    }

    if (well.division == null) navigate(`/well/${wellId}/region`);
    if (well.staining == null) navigate(`/well/${wellId}/staining`);
    if (well.depth == null) navigate(`/well/${wellId}/depth`);
    if (well.flooding == null) navigate(`/well/${wellId}/flooding`);
    if (well.wellInUse == null) navigate(`/well/${wellId}/well-in-use`);

    async function handleNext() {
        navigate(`/well/${wellId}/result`);
    }

    return (
        <WellDataEntryLayout
            title={
                <TranslatableText
                    variant="h4"
                    english="Review"
                    bengali="পর্যালোচনা"
                />
            }
            nextText={
                <TranslatableText
                    english="Review"
                    bengali="ফলাফল দেখুন"
                />
            }
            onNext={handleNext}
        >
            <Region well={well} />
            <Staining well={well} />
            <Depth well={well} />
            {well.depth && well.depth <= 15 && 
                <Flooding well={well} />
            }
            <Drinking well={well} />
            {token && <Images well={well} />}
        </WellDataEntryLayout>
    );
}
