"use client";

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&q=80",
        alt: "Community food drive",
        title: "Ramadan Food Drive 2024",
    },
    {
        src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&q=80",
        alt: "Volunteer distribution",
        title: "Winter Kits Distribution",
    },
    {
        src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80",
        alt: "Education support",
        title: "Back to School Program",
    },
    {
        src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&q=80",
        alt: "Community gathering",
        title: "Community Iftar Night",
    },
    {
        src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80",
        alt: "Volunteer team",
        title: "Volunteer Appreciation",
    },
    {
        src: "https://images.unsplash.com/photo-1578357078586-491adf1aa5ba?w=600&q=80",
        alt: "Winter aid",
        title: "Emergency Aid Response",
    },
];

export function GalleryOfEvents() {
    return (
        <section className="py-16 md:py-20 bg-card px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-foreground mb-3">
                        Gallery of Events
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Moments of impact from our community events
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                className="w-full h-[240px] object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                <p className="text-white font-semibold text-sm">{image.title}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
