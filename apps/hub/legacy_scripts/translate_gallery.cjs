const fs = require('fs');

const galleryPath = 'd:/vision_agentic/jigyasu/apps/hub/src/kidscamp/components/ActivityGallery.tsx';
let code = fs.readFileSync(galleryPath, 'utf8');

code = code.replace(/>\s*Age Group\s*<\/label>/, ">{t('gallery.age_group', 'Age Group')}</label>");
code = code.replace(/>\s*Difficulty\s*<\/label>/, ">{t('gallery.difficulty', 'Difficulty')}</label>");
code = code.replace(/>\s*Sort By\s*<\/label>/, ">{t('gallery.sort_by', 'Sort By')}</label>");

code = code.replace(/>\s*All\s*<\/button>/, ">{t('gallery.all', 'All')}</button>");
code = code.replace(/>\s*All\s*<\/button>/, ">{t('gallery.all', 'All')}</button>"); // second one
code = code.replace(/{diff === 'all' \? 'All' : diff}/g, "{diff === 'all' ? t('gallery.all', 'All') : t(`gallery.${diff.toLowerCase()}`, diff)}");

code = code.replace(/>Most Popular<\/option>/, ">{t('gallery.popular', 'Most Popular')}</option>");
code = code.replace(/>Highest Rated<\/option>/, ">{t('gallery.rating', 'Highest Rated')}</option>");
code = code.replace(/>Name \(A-Z\)<\/option>/, ">{t('gallery.name', 'Name (A-Z)')}</option>");
code = code.replace(/>Difficulty<\/option>/, ">{t('gallery.difficulty', 'Difficulty')}</option>");
code = code.replace(/>Quickest First<\/option>/, ">{t('gallery.quickest', 'Quickest First')}</option>");

code = code.replace(/>\s*Clear all filters\s*<\/button>/, ">{t('gallery.clear_all', 'Clear all filters')}</button>");
code = code.replace(/>\s*Clear filters\s*<\/button>/g, ">{t('gallery.clear', 'Clear filters')}</button>");

code = code.replace(/Showing <span/, "{t('gallery.showing', 'Showing')} <span");
code = code.replace(/<\/span> activities/, "</span> {t('gallery.activities_count', 'activities')}");

code = code.replace(/>\s*No activities found\s*<\/h3>/, ">{t('gallery.no_found', 'No activities found')}</h3>");
code = code.replace(/>\s*Try adjusting your filters or search terms\s*<\/p>/, ">{t('gallery.try_adjusting', 'Try adjusting your filters or search terms')}</p>");
code = code.replace(/>\s*Clear All Filters\s*<\/button>/, ">{t('gallery.clear_all', 'Clear All Filters')}</button>");

fs.writeFileSync(galleryPath, code);
console.log('Updated ActivityGallery.tsx');
