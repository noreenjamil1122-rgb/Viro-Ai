import { Request, Response } from 'express';
import { Template } from '../models/Template.js';

const SEED_TEMPLATES = [
  {
    title: 'Product Announcement & Launch',
    category: 'Product Showcase',
    description: 'Structure for announcing a new product, feature, or release with value propositions and call to action.',
    caption_template: 'Announce a new release for [Product Name]. Highlight the main problem it solves, 3 key benefits, and a clear call to action.',
    suggested_hashtags: ['#productlaunch', '#innovation', '#newfeature', '#saas', '#techupdate'],
    default_platforms: ['instagram', 'linkedin', 'twitter'],
    preview_image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=60',
  },
  {
    title: 'Customer Success & Proof',
    category: 'Social Proof',
    description: 'Share authentic client results, metrics, quotes, and testimonial transformations.',
    caption_template: 'Spotlight how [Customer/Client Name] achieved [Specific Result/Metric] using [Product/Service]. Include quote and takeaway.',
    suggested_hashtags: ['#casestudy', '#customerreview', '#growth', '#socialproof'],
    default_platforms: ['linkedin', 'twitter', 'facebook'],
    preview_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=60',
  },
  {
    title: 'Actionable Industry Insight',
    category: 'Thought Leadership',
    description: 'Provide breakdown of industry trend, contrarian perspective, or practical tactical guide.',
    caption_template: 'Explain 3 mistakes people make with [Industry Topic] and the exact step-by-step framework to fix it.',
    suggested_hashtags: ['#leadership', '#strategy', '#productivity', '#businesstips'],
    default_platforms: ['linkedin', 'twitter'],
    preview_image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=500&auto=format&fit=crop&q=60',
  },
  {
    title: 'Flash Sale & Limited Promotion',
    category: 'Promotion',
    description: 'High-urgency promotional post for seasonal discounts, holiday flash deals, or bundle offers.',
    caption_template: 'Announce [Discount %] OFF flash sale on [Product Line]. Emphasize deadline [Date/Time] with direct discount link.',
    suggested_hashtags: ['#flashsale', '#limitedoffer', '#deals', '#exclusive'],
    default_platforms: ['instagram', 'facebook', 'twitter'],
    preview_image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&auto=format&fit=crop&q=60',
  },
  {
    title: 'Behind the Scenes & Culture',
    category: 'Brand Story',
    description: 'Humanize the company with team stories, creation process, day-in-the-life, or bloopers.',
    caption_template: 'Take audience behind the scenes of how our team built [Feature/Milestone]. Share unexpected challenges and lessons.',
    suggested_hashtags: ['#behindthescenes', '#teamculture', '#buildinpublic', '#startup'],
    default_platforms: ['instagram', 'linkedin'],
    preview_image: 'https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?w=500&auto=format&fit=crop&q=60',
  },
];

import mongoose from 'mongoose';

export async function getTemplates(req: Request, res: Response) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        templates: SEED_TEMPLATES.map((t, idx) => ({ id: `tpl-${idx + 1}`, ...t })),
      });
    }

    let templates = await Template.find();

    if (templates.length === 0) {
      await Template.insertMany(SEED_TEMPLATES);
      templates = await Template.find();
    }

    const formatted = templates.map((t) => ({
      id: t._id.toString(),
      title: t.title,
      category: t.category,
      description: t.description,
      caption_template: t.caption_template,
      suggested_hashtags: t.suggested_hashtags,
      default_platforms: t.default_platforms,
      preview_image: t.preview_image,
    }));

    return res.json({ success: true, templates: formatted });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to fetch templates' });
  }
}
