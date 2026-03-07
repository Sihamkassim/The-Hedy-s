const catchAsync = require('../utils/catchAsync');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all support resources
exports.getAllResources = catchAsync(async (req, res) => {
  const { category } = req.query;

  const where = category ? { category } : {};

  const resources = await prisma.supportResource.findMany({
    where,
    orderBy: { category: 'asc' }
  });

  res.status(200).json({
    status: 'success',
    results: resources.length,
    data: { resources }
  });
});

// Get single support resource
exports.getResource = catchAsync(async (req, res) => {
  const { id } = req.params;

  const resource = await prisma.supportResource.findUnique({
    where: { id }
  });

  if (!resource) {
    return res.status(404).json({
      status: 'error',
      message: 'Resource not found'
    });
  }

  res.status(200).json({
    status: 'success',
    data: { resource }
  });
});

// Create support resource (admin only)
exports.createResource = catchAsync(async (req, res) => {
  const { name, phone, category } = req.body;

  const resource = await prisma.supportResource.create({
    data: {
      name,
      phone,
      category
    }
  });

  res.status(201).json({
    status: 'success',
    data: { resource }
  });
});

// Update support resource
exports.updateResource = catchAsync(async (req, res) => {
  const { id } = req.params;

  const resource = await prisma.supportResource.update({
    where: { id },
    data: req.body
  });

  res.status(200).json({
    status: 'success',
    data: { resource }
  });
});

// Delete support resource
exports.deleteResource = catchAsync(async (req, res) => {
  const { id } = req.params;

  await prisma.supportResource.delete({
    where: { id }
  });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
