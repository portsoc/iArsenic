import { Card, Box } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { Well } from 'iarsenic-types';
import { navigate } from 'wouter/use-browser-location';
import { useEffect, useState } from 'react';
import { useAccessToken } from '../../utils/useAccessToken';
import TranslatableText from '../../components/TranslatableText';

interface Props {
    well: Well;
}

export default function WellCard({ well }: Props): JSX.Element {
    const [thumbnailUrl, setThumbnailUrl] = useState<string>();
    const { data: token } = useAccessToken()
    
    useEffect(() => {
        async function fetchSignedUrl() {
            try {
                const headers: HeadersInit = {};

                if (token) {
                    headers["Authorization"] = `Bearer ${token.id}`;
                }

                const paths = well.imagePaths ?? [];

                if (paths.length === 0) {
                    return;
                }

                const res = await fetch(`/api/v1/self/well/${well.id}/signed-image-urls`, {
                    method: "POST",
                    headers: {
                        ...headers,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ paths }),
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error("Failed to fetch signed URLs:", text);
                    return;
                }

                const { urls } = await res.json();
                setThumbnailUrl(urls[0]);
            } catch (error) {
                console.error(error);
                console.error('error fetching thumbnail url');
            }
        }

        fetchSignedUrl();
    }, [well]);

    return (
        <Card
            variant="outlined"
            sx={{
                mb: 2,
                p: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: 2,
                cursor: 'pointer',
                width: '100%',
            }}
            onClick={() => navigate(`/well/${well.id}`)}
        >
            <Box>
                <TranslatableText 
                    english={`Well ${well.id}`} 
                    bengali='BENGALI PLACEHOLDER' 
                    variant='subtitle2'
                />
            </Box>

            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f0f0f0',
                }}
            >
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt="Well"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <ImageIcon sx={{ fontSize: 40, color: '#999' }} />
                )}
            </Box>
        </Card>
    );
}
