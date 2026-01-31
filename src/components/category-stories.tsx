import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const stories = [
    {
        id: 'adventure',
        label: 'Adventure',
        image: '/images/products/mountain_bike.png',
        color: 'from-orange-400 to-red-500',
    },
    {
        id: 'creative',
        label: 'Creative',
        image: '/images/products/canon_eos_r5.png',
        color: 'from-purple-400 to-pink-500',
    },
    {
        id: 'tech',
        label: 'Tech Pro',
        image: '/images/products/macbook_pro.png',
        color: 'from-blue-400 to-cyan-500',
    },
    {
        id: 'party',
        label: 'Party Time',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
        color: 'from-yellow-400 to-orange-500',
    },
    {
        id: 'home',
        label: 'Home Upgrade',
        image: '/images/products/velvet_sofa.png',
        color: 'from-emerald-400 to-green-500',
    },
    {
        id: 'travel',
        label: 'On the Go',
        image: '/images/products/tesla_model_3.png',
        color: 'from-indigo-400 to-blue-500',
    },
];

interface CategoryStoriesProps {
    onSelectCategory?: (id: string) => void;
}

export function CategoryStories({ onSelectCategory }: CategoryStoriesProps) {
    const navigate = useNavigate();

    const handleStoryClick = (id: string) => {
        if (onSelectCategory) {
            onSelectCategory(id);
        } else {
            navigate('/listings');
        }
    };

    return (
        <section className="py-10 border-b border-border/40">
            <div className="container mx-auto px-4">
                <h2 className="text-xl font-semibold mb-6">Explore by Vibe</h2>
                <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group snap-center"
                            onClick={() => handleStoryClick(story.id)}
                        >
                            <div className={`p-1 rounded-full bg-gradient-to-tr ${story.color} group-hover:rotate-6 transition-transform duration-300`}>
                                <div className="p-0.5 bg-background rounded-full">
                                    <div className="w-20 h-20 rounded-full overflow-hidden relative">
                                        <img
                                            src={story.image}
                                            alt={story.label}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                                {story.label}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
