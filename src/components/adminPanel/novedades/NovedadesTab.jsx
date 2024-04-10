import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import CreatePostCard from './NovedadesCreate';
import PostCard from './Novedades';
import { supabase } from '../../../services/client';

const NovedadesTab = ({business}) => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*').eq('negocioNombre', business.name)
            .order('id', { ascending: false });
        if (error) {
            console.error('Error fetching posts:', error.message);
        } else {
            setPosts(data);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleCreatePost = async (post) => {
        const { error } = await supabase
            .from('posts')
            .insert({ 'contenido': post, 'negocioNombre':business.name });
        if (error) {
            console.error('Error creating post:', error.message);
        }
        fetchPosts();
    };

    const handleDeletePost = async (postId) => {
        const { error } = await supabase
            .from('posts')
            .delete()
            .match({ id: postId });
        if (error) {
            console.error('Error deleting post:', error.message);
        } else {
            setPosts(posts.filter((post) => post.id !== postId));
        }
    };

    return (
        <Box>
            <CreatePostCard onCreatePost={handleCreatePost} image={business.photo_perfil}/>
            {posts.map((post) => (
                <Box key={post.id} sx={{ mt: 2 }}>
                    <PostCard post={post} onDeletePost={handleDeletePost} image={business?.photo_perfil} />
                </Box>
            ))}
        </Box>
    );
};

export default NovedadesTab;