import { writable } from 'svelte/store'

export const labelTranslations = writable({
	refA: {
		en: 'Ref. A',
		ar: 'رقم المرجع'
	},
	refZ: {
		en: 'Ref. Z+',
		ar: 'رقم المرجع- زينة'
	},
	ref: {
		en: 'Ref.',
		ar: 'رقم المرجع'
	},
	collection: {
		en: 'Collection',
		ar: 'مجموعة'
	},
	title: {
		en: 'Title',
		ar: 'العنوان'
	},
	series: {
		en: 'Series',
		ar: 'سلسلة'
	},
	author: {
		en: 'Author',
		ar: 'مؤلف'
	},
	translator: {
		en: 'Translator',
		ar: 'ترجمة'
	},
	publisher: {
		en: 'Publisher',
		ar: 'دار النشر'
	},
	place: {
		en: 'Place',
		ar: 'المدينة'
	},
	year: {
		en: 'Year',
		ar: 'السنة'
	},
	edition: {
		en: 'Edition',
		ar: 'الطبعة'
	},
	printer: {
		en: 'Printer',
		ar: 'المطبعة'
	},
	coverDesign: {
		en: 'Cover design',
		ar: 'تصميم الغلاف'
	},
	coverIllustration: {
		en: 'Cover illustration',
		ar: 'رسوم الغلاف'
	},
	pageDesign: {
		en: 'Page design',
		ar: 'تصميم الداخل'
	},
	pageIllustration: {
		en: 'Page illustration',
		ar: 'رسوم الداخل'
	},
	coverCalligraphy: {
		en: 'Cover calligraphy',
		ar: 'خط الغلاف'
	},
	pageCalligraphy: {
		en: 'Page calligraphy',
		ar: 'خط الداخل'
	},
	numberOfPages: {
		en: 'Pages',
		ar: 'عدد الصفحات'
	},
	size: {
		en: 'Size',
		ar: 'الحجم'
	},
	notes: {
		en: 'Notes',
		ar: 'ملاحظات'
	},
	exhibition: {
		en: 'Exhibition',
		ar: 'معرض'
	},
	pages: {
		en: 'pages',
		ar: 'الصفحات'
	},
    image: {
        en: 'image',
        ar: 'صورة'
    },
    images: {
        en: 'images',
        ar: 'صور'
    },
    artistdesigner: {
        en: 'Artist/designer',
        ar: 'الفنان/المُصمّم'
    },
    search: {
        en: 'Search',
        ar: 'بحث'
    },
    filterBy: {
        en: 'Filter by',
        ar: 'تصفية حسب'
    },
    nobooks: {
        en: 'No books found matching the current filters.',
        ar: 'لم يتم العثور على كتب تطابق المرشحات الحالية.'
    }
})
