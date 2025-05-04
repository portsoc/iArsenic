import { Button, Card, Typography, Box, Alert } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import { AccessToken } from "iarsenic-types";
import AccessTokenRepo from "../../utils/AccessTokenRepo";
import { resizeImage } from "../../utils/resizeImage";
import { navigate } from "wouter/use-browser-location";
import PhotoItem from "./PhotoItem";

export default function WellImageUpload(): JSX.Element {
    const [, params] = useRoute('/well/:id/upload-image');
    const wellId = params?.id;
    const [token, setToken] = useState<AccessToken>();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    async function fetchWellAndImages(wellId: string, token: AccessToken | null = null) {
        const headers: HeadersInit = {} 
        
        if (token != null) {
            headers["Authorization"] = `Bearer ${token.id}`
        };
    
        const wellRes = await fetch(`/api/v1/self/well/${wellId}`, { headers });
        if (!wellRes.ok) return;
    
        const well = await wellRes.json();
    
        const paths = well.imagePaths || [];
    
        if (paths.length === 0) {
            setImageUrls([]);
            return;
        }
    
        const urlsRes = await fetch(`/api/v1/self/well/${wellId}/signed-image-urls`, {
            method: "POST",
            headers: {
                ...headers,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ paths })
        });
    
        if (!urlsRes.ok) {
            const text = await urlsRes.text();
            console.error("Failed to fetch signed URLs:", text);
            return;
        }

        const { urls } = await urlsRes.json();
        setImageUrls(urls);
    }

    async function onImageDelete(path: string) {
        if (!wellId) return;
    
        const headers: HeadersInit = {
            "Content-Type": "application/json"
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token.id}`
        }
    
        const res = await fetch(`/api/v1/self/well/${wellId}/image`, {
            method: "DELETE",
            headers,
            body: JSON.stringify({ path }),
        });
    
        if (!res.ok) {
            const text = await res.text();
            console.error("Failed to delete image:", text);
            return;
        }
    
        // Refresh well and image URLs after deletion
        await fetchWellAndImages(wellId, token);
    }

    useEffect(() => {
        async function load() {
            const token = await AccessTokenRepo.get();
            if (!wellId) return;
            if (token) {
                setToken(token);
                await fetchWellAndImages(wellId, token);
            } else {
                await fetchWellAndImages(wellId);
            }
        }

        load();
    }, [wellId]);
    

    async function handleUpload() {
        if (!file || !wellId) {
            setError("Missing file, or well ID");
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(false);

        let resizedBlob: Blob;
        try {
            resizedBlob = await resizeImage(file);
        } catch (resizeError) {
            setUploading(false);
            setError(`Failed to resize image: ${String(resizeError)}`);
            return;
        }

        try {
            const headers: HeadersInit = {
                "Authorization": `Bearer ${token?.id || ""}`
            };

            const contentType = resizedBlob.type;
            const uploadUrlRes = await fetch(`/api/v1/self/well/${wellId}/upload-url`, {
                method: "POST",
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ contentType })
            });

            if (!uploadUrlRes.ok) {
                throw new Error(await uploadUrlRes.text());
            }

            const { url, path } = await uploadUrlRes.json();

            const uploadRes = await fetch(url, {
                method: "PUT",
                headers: {
                    'Content-Type': contentType
                },
                body: resizedBlob
            });

            if (!uploadRes.ok) {
                throw new Error("Failed to upload image to signed URL");
            }

            const confirmRes = await fetch(`/api/v1/self/well/${wellId}/confirm-upload`, {
                method: "POST",
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ path })
            });

            if (!confirmRes.ok) {
                throw new Error(await confirmRes.text());
            }

            setSuccess(true);
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Fetch updated images
            const newUrlsRes = await fetch(`/api/v1/self/well/${wellId}/signed-image-urls`, {
                method: "POST",
                headers: {
                    ...headers,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ paths: [path] })
            });

            const { urls } = await newUrlsRes.json();
            setImageUrls(urls);

        } catch (err: any) {
            setError(`Upload failed: ${err.message || err}`);
        } finally {
            setUploading(false);
        }
    }

    return (
        <>
            <Typography textAlign="center" variant="h4" gutterBottom>
                Upload Well Image
            </Typography>

            <Card
                variant="outlined"
                sx={{
                    width: '100%',
                    padding: '16px',
                    marginBottom: '16px',
                }}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    ref={fileInputRef}
                />

                <Button
                    variant="contained"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    sx={{ width: "100%", height: "3rem" }}
                >
                    {uploading ? "Uploading..." : "Upload"}
                </Button>

                {success && <Alert severity="success">Image uploaded successfully!</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
            </Card>

            <Card
                variant="outlined"
                sx={{
                    width: '100%',
                    padding: '16px',
                    marginBottom: '16px',
                }}
            >

                {imageUrls.length > 0 && (
                    <Box 
                        width='100%' 
                        mt={2}
                        display="flex" 
                        alignItems='center'
                        flexDirection='column'
                    >
                        <Typography 
                            variant="h5" 
                            justifyContent='center' 
                            mb={2}
                        >
                            Uploaded Images
                        </Typography>
                        <Box 
                            flexWrap="wrap" 
                            gap="1rem"
                        >
                            {imageUrls.map((url, i) => (
                                <PhotoItem 
                                    key={url} 
                                    url={url} 
                                    index={i} 
                                    onDelete={onImageDelete}
                                />
                            ))}
                        </Box>
                    </Box>
                )}
            </Card>

            <Button
                sx={{ width: '90%', height: '4rem' }}
                variant='contained'

                onClick={() => {
                    if (token) {
                        navigate(`/well/${wellId}`);
                        return;
                    }
                    navigate(`/well/${wellId}/result`);
                }}
            >
                Next Step
            </Button>
        </>
    );
}
