export interface Book {
    id: string;
    title: string;
    description?: string;
    creator: string; // Author
    coverImage: string;
    downloads?: number;
}

export interface BookDetail extends Book {
    tracks: AudioTrack[];
}

export interface AudioTrack {
    title: string;
    uri: string;
    duration?: number;
    trackNumber: number;
}

const BASE_URL = 'https://archive.org/advancedsearch.php';
const METADATA_URL = 'https://archive.org/metadata';

export const fetchBooks = async (query = 'collection:(librivox_audiobooks)', limit = 10): Promise<Book[]> => {
    try {
        const url = `${BASE_URL}?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=description&fl[]=downloads&sort[]=downloads+desc&rows=${limit}&page=1&output=json`;

        const response = await fetch(url);
        const data = await response.json();

        return data.response.docs.map((doc: any) => ({
            id: doc.identifier,
            title: doc.title,
            description: doc.description,
            creator: doc.creator || 'Unknown Author',
            coverImage: `https://archive.org/services/img/${doc.identifier}`,
            downloads: doc.downloads
        }));
    } catch (error) {
        console.error("Error fetching books:", error);
        return [];
    }
};

export const fetchBookDetails = async (identifier: string): Promise<BookDetail | null> => {
    try {
        const response = await fetch(`${METADATA_URL}/${identifier}`);
        const data = await response.json();

        if (!data.metadata || !data.files) return null;

        // Filter for MP3 files
        const mp3Files = data.files.filter((file: any) =>
            file.format === 'VBR MP3' || file.format === '128Kbps MP3' || file.format === '64Kbps MP3'
        ).sort((a: any, b: any) => {
            // Try to sort by track number safely
            const trackA = parseInt(a.track || '0');
            const trackB = parseInt(b.track || '0');
            return trackA - trackB;
        });

        const tracks: AudioTrack[] = mp3Files.map((file: any, index: number) => ({
            title: file.title || file.name,
            uri: `https://archive.org/download/${identifier}/${file.name}`,
            duration: parseFloat(file.length || '0'),
            trackNumber: index + 1
        }));

        const meta = data.metadata;

        return {
            id: identifier,
            title: meta.title,
            description: meta.description,
            creator: meta.creator,
            coverImage: `https://archive.org/services/img/${identifier}`,
            tracks: tracks
        };

    } catch (error) {
        console.error("Error fetching book details:", error);
        return null;
    }
};
