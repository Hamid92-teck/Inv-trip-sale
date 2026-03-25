const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const { generateInvoicePDF } = require('../services/pdfService');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().populate('createdBy', 'username email');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('createdBy');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  const invoice = new Invoice(req.body);
  try {
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate PDF
router.get('/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    
    const pdfPath = await generateInvoicePDF(invoice);
    res.download(pdfPath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;