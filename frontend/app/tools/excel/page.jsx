"use client";
import React from 'react';
import Head from 'next/head';
import { motion } from "framer-motion";
import { Table, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ExcelToolsPage() {
    const excelTools = [
        {
            title: "Excel Compressor",
            description: "Compress Excel files to save storage space",
            color: 'from-teal-500 to-green-500',
            link: "/tools/excel-compressor",
            available: true
        },
        {
            title: "Excel to PDF",
            description: "Convert Excel spreadsheets to PDF format",
            color: 'from-green-500 to-emerald-500',
            link: "/tools/excel-to-pdf",
            available: true
        },
        {
            title: "CSV to Excel",
            description: "Convert CSV files to Excel format",
            color: 'from-blue-500 to-indigo-500',
            link: "/tools/csv-to-excel",
            available: true
        },
        {
            title: "Excel to CSV",
            description: "Export Excel data to CSV format",
            color: 'from-purple-500 to-pink-500',
            link: "/tools/excel-to-csv",
            available: true
        },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 bg-background">
            <Head>
                <title>Free Excel Tools Online | Compress, Convert Spreadsheets</title>
                <meta name="description" content="Free Excel tools to compress, convert to PDF/CSV. Work with spreadsheets online without Excel installed." />
                <meta name="keywords" content="excel compressor, excel to pdf, excel to csv, csv to excel, spreadsheet tools" />
                <meta property="og:title" content="Free Excel & Spreadsheet Tools" />
                <meta property="og:description" content="Convert and process Excel files online" />
            </Head>
            <div className="container mx-auto px-6">
                <Link href="/tools">
                    <Button variant="ghost" className="mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Categories
                    </Button>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <Table className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Excel Tools</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Process and convert Excel spreadsheets efficiently
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {excelTools.map((tool, index) => (
                        <Link key={index} href={tool.link}>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer relative"
                            >
                                {!tool.available && (
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-600 text-xs font-semibold">
                                        Coming Soon
                                    </div>
                                )}

                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Table className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {tool.description}
                                </p>
                                <span className="text-sm font-semibold text-primary opacity-80 group-hover:opacity-100">
                                    {tool.available ? 'Try Now →' : 'Coming Soon'}
                                </span>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
