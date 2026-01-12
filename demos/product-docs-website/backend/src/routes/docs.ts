import { Router } from 'express';
import { filterDocs, findDocById } from '../services/docsService';

const router = Router();

router.get('/', (req, res) => {
  const { q, category } = req.query;
  const docs = filterDocs({
    q: typeof q === 'string' ? q : undefined,
    category: typeof category === 'string' ? category : undefined
  });
  res.json(docs);
});

router.get('/:id', (req, res) => {
  const doc = findDocById(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.json(doc);
});

export default router;
