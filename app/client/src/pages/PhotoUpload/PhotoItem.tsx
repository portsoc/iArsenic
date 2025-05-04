import { Box, Stack, CircularProgress, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useEffect, useRef, useState } from "react";

interface Props {
    url: string;
    index: number;
    onDelete: (path: string) => Promise<void>;
}

function extractPathFromSignedUrl(url: string): string {
    try {
        const u = new URL(url);
        const parts = u.pathname.split('/');
        const imagePath = parts.slice(2).join('/');
        return decodeURIComponent(imagePath);
    } catch (e) {
        throw new Error("Invalid URL — cannot extract path");
    }
}


export default function PhotoItem({ url, index, onDelete }: Props) {
    const [deleteState, setDeleteState] = useState<'wait' | 'confirm' | 'deleting'>('wait');
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                deleteState === 'confirm' &&
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setDeleteState('wait');
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [deleteState]);

    async function handleDeleteClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (deleteState === 'wait') {
            setDeleteState('confirm');
        } else if (deleteState === 'confirm') {
            setDeleteState('deleting');
            try {
                await onDelete(extractPathFromSignedUrl(url));
            } finally {
                setDeleteState('wait');
            }
        }
    }

    return (
        <Box
            ref={containerRef}
            position="relative"
            my={1}
            sx={{
                width: 200,
                height: 200,
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            <img
                src={url}
                alt={`Well image ${index + 1}`}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            <Stack
                direction="row"
                spacing={1}
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                }}
            >
                <Box
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(url, "_blank");
                    }}
                    sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        "&:hover": {
                            backgroundColor: "rgba(0,0,0,0.8)",
                        },
                    }}
                >
                    <OpenInNewIcon sx={{ color: "white" }} />
                </Box>

                {deleteState === 'deleting' ? (
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: "rgba(0,0,0,0.6)",
                        }}
                    >
                        <CircularProgress
                            size={20}
                            sx={{ color: "whitesmoke" }}
                        />
                    </Box>
                ) : deleteState === 'confirm' ? (
                    <Box
                        onClick={handleDeleteClick}
                        sx={{
                            width: 40,
                            minWidth: 'max-content',
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: "rgba(255,0,0,0.8)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "rgba(200,0,0,0.8)",
                            },
                        }}
                    >
                        <Typography
                            variant="caption"
                            fontWeight="bold"
                            color="white"
                            px={2}
                            sx={{ fontSize: '0.7rem' }}
                        >
                            Delete?
                        </Typography>
                    </Box>
                ) : (
                    <Box
                        onClick={handleDeleteClick}
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.8)",
                            },
                        }}
                    >
                        <DeleteIcon sx={{ color: "white" }} />
                    </Box>
                )}
            </Stack>
        </Box>
    );
}
