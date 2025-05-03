import { Button, Card, Typography, Box, Alert } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useRoute } from "wouter";
import { AccessToken } from "iarsenic-types";
import AccessTokenRepo from "../../utils/AccessTokenRepo";
import { resizeImage } from "../../utils/resizeImage";

export default function WellImageUpload(): JSX.Element {
    const [, params] = useRoute('/well/:id/upload-image');
    const wellId = params?.id;
    const [token, setToken] = useState<AccessToken>();
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        async function fetchToken() {
            const token = await AccessTokenRepo.get();
            if (token == null) return;
            setToken(token);
        }
        fetchToken();
    }, []);

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
            const headers: HeadersInit = {};
            if (token) {
                headers["Authorization"] = `Bearer ${token.id}`;
            }

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
        } catch (err: any) {
            setError(`Upload failed: ${err.message || err}`);
        } finally {
            setUploading(false);
        }
    }

    return (
        <Box m={2}>
            <Typography textAlign="center" variant="h4" gutterBottom>
                Upload Well Image
            </Typography>

            <Card
                variant="outlined"
                sx={{
                    padding: "1.5rem",
                    margin: "0 auto",
                    maxWidth: "600px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
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
        </Box>
    );
}
